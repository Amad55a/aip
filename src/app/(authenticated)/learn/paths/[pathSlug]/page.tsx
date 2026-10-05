import { notFound } from "next/navigation";
import LearnRoadmap from "@/components/learn/LearnRoadmap";
import type { LessonState } from "@/components/learn/LessonStatus";
import { createClient } from "@/lib/supabase/server";
import { getServerLanguage } from "@/lib/i18n/server-language";
import type { Course, Lesson, Module } from "@/lib/supabase/database.types";

type PathCourse = Pick<Course, "id" | "title" | "slug" | "description" | "order_index"> & {
  modules: (Pick<
    Module,
    "id" | "course_id" | "slug" | "title" | "description" | "level" | "estimated_hours"
  > & { lessons: Pick<Lesson, "id" | "module_id" | "slug" | "title" | "lesson_type">[] })[];
};

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ pathSlug: string }>;
}) {
  const { pathSlug } = await params;
  const language = await getServerLanguage();
  const supabase = await createClient();
  const { data: path, error: pathError } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("slug", pathSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (pathError) {
    console.error("Unable to load learning path overview.", {
      pathSlug,
      code: pathError.code,
      message: pathError.message,
    });
    throw new Error("This learning path is temporarily unavailable.");
  }
  if (!path) notFound();

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("id,learning_path_id,title,slug,description,order_index,translations")
    .eq("learning_path_id", path.id)
    .eq("is_published", true)
    .order("order_index");
  if (coursesError) throw new Error("This learning path is temporarily unavailable.");

  const courseIds = courses.map((course) => course.id);
  const { data: modules, error: modulesError } = courseIds.length
    ? await supabase
        .from("modules")
        .select("id,course_id,slug,title,description,level,estimated_hours,order_index,translations")
        .in("course_id", courseIds)
        .eq("is_published", true)
        .order("order_index")
    : { data: [], error: null };
  if (modulesError) throw new Error("This learning path is temporarily unavailable.");

  const moduleIds = modules.map((module) => module.id);
  const { data: lessons, error: lessonsError } = moduleIds.length
    ? await supabase
        .from("lessons")
        .select("id,module_id,slug,title,lesson_type,order_index,translations")
        .in("module_id", moduleIds)
        .eq("is_published", true)
        .order("order_index")
    : { data: [], error: null };
  if (lessonsError) throw new Error("This learning path is temporarily unavailable.");

  const localizedPath = {
    ...path,
    title: path.translations[language]?.title ?? path.title,
    description: path.translations[language]?.description ?? path.description,
    short_description: path.translations[language]?.short_description ?? path.short_description,
  };
  const pathCourses: PathCourse[] = courses.map((course) => ({
    ...course,
    title: course.translations[language]?.title ?? course.title,
    description: course.translations[language]?.description ?? course.description,
    modules: modules
      .filter((module) => module.course_id === course.id)
      .map((module) => ({
        ...module,
        title: module.translations[language]?.title ?? module.title,
        description: module.translations[language]?.description ?? module.description,
        lessons: lessons
          .filter((lesson) => lesson.module_id === module.id)
          .map((lesson) => ({
            ...lesson,
            title: lesson.translations[language]?.title ?? lesson.title,
          })),
      })),
  }));

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) notFound();
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("learning_path_id", path.id)
    .maybeSingle();
  if (enrollmentError) throw new Error("Your learning progress is temporarily unavailable.");

  const allLessons = pathCourses.flatMap((course) =>
    course.modules.flatMap((module) => module.lessons)
  );
  const lessonStates: Record<string, LessonState> = {};
  let resumeHref = "/learn";
  if (allLessons.length) {
    const { data: progress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id,status,last_accessed_at")
      .eq("user_id", user.id);
    if (progressError) throw new Error("Your learning progress is temporarily unavailable.");

    const progressByLesson = new Map(progress.map((record) => [record.lesson_id, record]));
    for (const lesson of allLessons) {
      lessonStates[lesson.id] = progressByLesson.get(lesson.id)?.status ?? "not_started";
    }
    const ordered = pathCourses.flatMap((course) =>
      course.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({ lesson, course, module }))
      )
    );
    const active = progress
      .filter((record) => record.status === "in_progress")
      .sort((left, right) => (right.last_accessed_at ?? "").localeCompare(left.last_accessed_at ?? ""))[0];
    const target =
      ordered.find((item) => item.lesson.id === active?.lesson_id) ??
      ordered.find((item) => lessonStates[item.lesson.id] !== "completed") ??
      ordered[0];
    resumeHref = `/learn/${target.course.slug}/${target.module.slug}/${target.lesson.slug}`;
  }

  return (
    <LearnRoadmap
      path={localizedPath}
      courses={pathCourses}
      lessonStates={lessonStates}
      enrolled={Boolean(enrollment)}
      startHref={resumeHref}
    />
  );
}
