import WelcomeSection from "@/components/dashboard/WelcomeSection";
import LearningBanner from "@/components/dashboard/LearningBanner";
import CurrentProgress from "@/components/dashboard/CurrentProgress";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import QuickNavigation from "@/components/dashboard/QuickNavigation";
import DashboardProjectsSummary from "@/components/dashboard/DashboardProjectsSummary";
import { PROJECTS } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import { getServerLanguage } from "@/lib/i18n/server-language";

export default async function DashboardPage() {
  const language = await getServerLanguage();
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error(`Unable to identify the signed-in learner: ${authError?.message ?? "No user"}`);
  }

  const { data: projectCompletions, error: projectCompletionsError } = await supabase
    .from("project_completions")
    .select("project_id")
    .eq("user_id", user.id);
  if (projectCompletionsError) {
    throw new Error(`Unable to load project completions: ${projectCompletionsError.message}`);
  }

  const { data: path, error: pathError } = await supabase
    .from("learning_paths")
    .select("id,title,translations")
    .eq("slug", "web-development-mern-stack")
    .eq("is_published", true)
    .maybeSingle();
  if (pathError) throw new Error(`Unable to load the learning path: ${pathError.message}`);
  const localizedPath = path
    ? {
        ...path,
        title: path.translations[language]?.title ?? path.title,
      }
    : null;

  let currentProgress: {
    title: string;
    completedLessons: number;
    totalLessons: number;
    href: string;
  } | null = null;
  let continueData: {
    pathId: string;
    pathTitle: string;
    enrolled: boolean;
    courseTitle: string | null;
    moduleTitle: string | null;
    lessonTitle: string | null;
    href: string;
  } | null = null;

  if (path) {
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("learning_path_id", path.id)
      .maybeSingle();
    if (enrollmentError) {
      throw new Error(`Unable to load learning path enrollment: ${enrollmentError.message}`);
    }

    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("id,title,slug,order_index,translations")
      .eq("learning_path_id", path.id)
      .eq("is_published", true)
      .order("order_index");
    if (coursesError) throw new Error(`Unable to load courses: ${coursesError.message}`);
    const localizedCourses = courses.map((course) => ({
      ...course,
      title: course.translations[language]?.title ?? course.title,
    }));

    const { data: modules, error: modulesError } = localizedCourses.length
      ? await supabase
          .from("modules")
          .select("id,course_id,title,slug,order_index,translations")
          .in("course_id", localizedCourses.map((course) => course.id))
          .eq("is_published", true)
          .order("order_index")
      : { data: [], error: null };
    if (modulesError) throw new Error(`Unable to load modules: ${modulesError.message}`);
    const localizedModules = modules.map((module) => ({
      ...module,
      title: module.translations[language]?.title ?? module.title,
    }));

    const { data: lessons, error: lessonsError } = localizedModules.length
      ? await supabase
          .from("lessons")
          .select("id,module_id,title,slug,order_index,translations")
          .in("module_id", localizedModules.map((module) => module.id))
          .eq("is_published", true)
          .order("order_index")
      : { data: [], error: null };
    if (lessonsError) throw new Error(`Unable to load lessons: ${lessonsError.message}`);
    const localizedLessons = lessons.map((lesson) => ({
      ...lesson,
      title: lesson.translations[language]?.title ?? lesson.title,
    }));

    const orderedLessons = localizedCourses.flatMap((course) =>
      localizedModules
        .filter((module) => module.course_id === course.id)
        .flatMap((module) =>
          localizedLessons
            .filter((lesson) => lesson.module_id === module.id)
            .map((lesson) => ({ ...lesson, module, course }))
        )
    );
    const startHref = orderedLessons[0]
      ? `/learn/${orderedLessons[0].course.slug}/${orderedLessons[0].module.slug}/${orderedLessons[0].slug}`
      : "/learn";

    let learnerProgress: {
      lesson_id: string;
      status: "not_started" | "in_progress" | "completed";
      last_accessed_at: string | null;
    }[] = [];
    if (enrollment && orderedLessons.length > 0) {
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id,status,last_accessed_at")
        .eq("user_id", user.id);
      if (error) throw new Error(`Unable to load lesson progress: ${error.message}`);
      const pathLessonIds = new Set(orderedLessons.map((lesson) => lesson.id));
      learnerProgress = data.filter((item) => pathLessonIds.has(item.lesson_id));
    }

    const progressByLesson = new Map(learnerProgress.map((item) => [item.lesson_id, item]));
    const lastActive = learnerProgress
      .filter((item) => item.status === "in_progress")
      .sort((a, b) =>
        (b.last_accessed_at ?? "").localeCompare(a.last_accessed_at ?? "")
      )[0];
    const target =
      orderedLessons.find((lesson) => lesson.id === lastActive?.lesson_id) ??
      orderedLessons.find((lesson) => progressByLesson.get(lesson.id)?.status !== "completed") ??
      orderedLessons[0];
    const continueHref = target
      ? `/learn/${target.course.slug}/${target.module.slug}/${target.slug}`
      : "/learn";

    if (enrollment) {
      currentProgress = {
        title: localizedPath?.title ?? path.title,
        completedLessons: learnerProgress.filter((item) => item.status === "completed").length,
        totalLessons: orderedLessons.length,
        href: continueHref,
      };
    }

    continueData = {
      pathId: path.id,
      pathTitle: localizedPath?.title ?? path.title,
      enrolled: Boolean(enrollment),
      courseTitle: enrollment ? target?.course.title ?? null : null,
      moduleTitle: enrollment ? target?.module.title ?? null : null,
      lessonTitle: enrollment ? target?.title ?? null : null,
      href: enrollment ? continueHref : startHref,
    };
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-5 py-8 pb-24 sm:px-8 sm:py-10 md:pb-10">
      <WelcomeSection />
      <LearningBanner />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CurrentProgress learningPath={currentProgress} />
        <ContinueLearning data={continueData} />
      </div>
      <div className="border-t border-[var(--border)]" />
      <DashboardProjectsSummary
        completedProjects={projectCompletions.filter((item) =>
          PROJECTS.some((project) => project.id === item.project_id)
        ).length}
        totalProjects={PROJECTS.length}
      />
      <QuickNavigation />
    </div>
  );
}
