import Link from "next/link";
import { notFound } from "next/navigation";
import LessonQuiz from "@/components/learn/LessonQuiz";
import ContentLanguageFallbackNotice from "@/components/app/ContentLanguageFallbackNotice";
import LessonNavigation from "@/components/learn/LessonNavigation";
import LessonPager from "@/components/learn/LessonPager";
import LessonProgress from "@/components/learn/LessonProgress";
import LessonStudyGuide from "@/components/learn/LessonStudyGuide";
import RichContent from "@/components/content/RichContent";
import {
  AskAIMentorButton,
  CompleteLessonButton,
} from "@/components/learn/LessonActions";
import {
  buildLessonMaterial,
  resolveLessonQuiz,
} from "@/lib/learning/lesson-content";
import { getServerLanguage } from "@/lib/i18n/server-language";
import { translations } from "@/i18n";
import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/supabase/database.types";

type LessonSummary = Pick<
  Lesson,
  "id" | "module_id" | "slug" | "title" | "lesson_type" | "order_index" | "estimated_minutes"
>;

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; moduleSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const language = await getServerLanguage();
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error(`Unable to identify the signed-in learner: ${authError?.message ?? "No user"}`);
  }
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id,learning_path_id,title,slug,description,translations")
    .eq("slug", courseSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (courseError) {
    throw new Error(`Unable to load the ${courseSlug} course: ${courseError.message}`);
  }
  if (!course) notFound();
  const { data: path, error: pathError } = await supabase
    .from("learning_paths")
    .select("id,slug,title,translations")
    .eq("id", course.learning_path_id)
    .eq("is_published", true)
    .maybeSingle();
  if (pathError) throw new Error("This learning path is temporarily unavailable.");
  if (!path) notFound();
  const localizedPath = {
    ...path,
    title: path.translations[language]?.title ?? path.title,
  };

  const localizedCourse = {
    ...course,
    title: course.translations[language]?.title ?? course.title,
    description: course.translations[language]?.description ?? course.description,
  };

  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id,slug,title,description,level,order_index,translations")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("order_index");

  if (modulesError) {
    throw new Error(`Unable to load ${localizedCourse.title} modules: ${modulesError.message}`);
  }
  const localizedModules = modules.map((item) => ({
    ...item,
    title: item.translations[language]?.title ?? item.title,
    description: item.translations[language]?.description ?? item.description,
  }));
  const strings = translations[language].appShell.lessonContent;

  const currentModule = localizedModules.find((item) => item.slug === moduleSlug);
  if (!currentModule) notFound();

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", currentModule.id)
    .eq("slug", lessonSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (lessonError) {
    throw new Error(`Unable to load lesson content: ${lessonError.message}`);
  }
  if (!lesson) notFound();
  const localizedContent = lesson.translations[language];
  const localizedLesson = {
    ...lesson,
    title: localizedContent?.title ?? lesson.title,
    description: localizedContent?.description ?? lesson.description,
    content: localizedContent?.content ?? lesson.content,
    explanation: localizedContent?.explanation ?? lesson.explanation,
    examples: localizedContent?.examples ?? lesson.examples,
    code_examples: localizedContent?.code_examples ?? lesson.code_examples,
    notes: localizedContent?.notes ?? lesson.notes,
    common_mistakes: localizedContent?.common_mistakes ?? lesson.common_mistakes,
    practice: localizedContent?.practice ?? lesson.practice,
    quiz_questions: localizedContent?.quiz_questions ?? lesson.quiz_questions,
  };
  const material = buildLessonMaterial({
    courseSlug: localizedCourse.slug,
    courseTitle: localizedCourse.title,
    moduleTitle: currentModule.title,
    lessonTitle: localizedLesson.title,
    description: localizedLesson.description,
    level: currentModule.level,
  });
  const studyMaterial = {
    introduction: material.introduction,
    explanation: material.explanation,
    example: material.example,
    codeExample: material.codeExample,
    useCases: material.useCases,
    mistakes: material.mistakes,
    tips: material.tips,
    practice: material.practice,
    ...localizedContent?.study_material,
  };
  const availableQuiz = resolveLessonQuiz(localizedLesson.quiz_questions, material);

  let lessonSummaries: LessonSummary[] = [];
  if (modules.length > 0) {
    const { data, error } = await supabase
      .from("lessons")
      .select("id,module_id,slug,title,lesson_type,order_index,estimated_minutes,translations")
      .in("module_id", modules.map((item) => item.id))
      .eq("is_published", true)
      .order("order_index");

    if (error) {
      throw new Error(`Unable to load lesson navigation: ${error.message}`);
    }
    lessonSummaries = data.map((item) => ({
      ...item,
      title: item.translations[language]?.title ?? item.title,
    }));
  }

  const orderedLessons = localizedModules.flatMap((item) =>
    lessonSummaries
      .filter((summary) => summary.module_id === item.id)
      .map((summary) => ({ ...summary, module: item }))
  );
  const currentIndex = orderedLessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < orderedLessons.length - 1
      ? orderedLessons[currentIndex + 1]
      : null;

  const accessedAt = new Date().toISOString();
  const { error: createProgressError } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lesson.id,
      status: "in_progress",
      started_at: accessedAt,
      last_accessed_at: accessedAt,
    },
    { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
  );
  if (createProgressError) {
    throw new Error(`Unable to start lesson progress: ${createProgressError.message}`);
  }
  const { error: accessError } = await supabase
    .from("lesson_progress")
    .update({ last_accessed_at: accessedAt })
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id);
  if (accessError) {
    throw new Error(`Unable to update lesson access time: ${accessError.message}`);
  }
  const { data: savedProgress, error: savedProgressError } = await supabase
    .from("lesson_progress")
    .select("status,started_at")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();
  if (savedProgressError) {
    throw new Error(`Unable to read lesson state: ${savedProgressError.message}`);
  }
  const { error: activeError } = savedProgress?.status !== "completed"
    ? await supabase
        .from("lesson_progress")
        .update({
          status: "in_progress",
          started_at: savedProgress?.started_at ?? accessedAt,
        })
        .eq("user_id", user.id)
        .eq("lesson_id", lesson.id)
        .neq("status", "completed")
    : { error: null };
  if (activeError) {
    throw new Error(`Unable to update lesson state: ${activeError.message}`);
  }
  const { data: progressRecords, error: progressError } = await supabase
    .from("lesson_progress")
    .select("lesson_id,status,quiz_score")
    .eq("user_id", user.id);
  if (progressError) {
    throw new Error(`Unable to load lesson progress: ${progressError.message}`);
  }
  const currentProgress = progressRecords.find((item) => item.lesson_id === lesson.id);
  const lessonStatus = currentProgress?.status ?? "not_started";
  const navigationModules = localizedModules.map((moduleItem) => ({
    id: moduleItem.id,
    slug: moduleItem.slug,
    title: moduleItem.title,
    lessons: orderedLessons
      .filter((summary) => summary.module.id === moduleItem.id)
      .map((summary) => ({
        id: summary.id,
        slug: summary.slug,
        title: summary.title,
        status: progressRecords.find((record) => record.lesson_id === summary.id)?.status ?? "not_started" as const,
      })),
  }));
  const completedLessons = orderedLessons.filter(
    (summary) => progressRecords.find((record) => record.lesson_id === summary.id)?.status === "completed"
  ).length;
  const nextHref = nextLesson
    ? `/learn/${course.slug}/${nextLesson.module.slug}/${nextLesson.slug}`
    : null;
  const quizQuestions = availableQuiz.map(({ id, type, prompt, options }) => ({
    id,
    type,
    prompt,
    options,
  }));

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl flex-1">
        <div className="min-w-0 px-4 py-6 sm:px-8 sm:py-9 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-5">
              <ContentLanguageFallbackNotice
                contentType="lesson"
                isTranslated={language === "en" || Boolean(localizedContent?.study_material)}
              />
            </div>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-[var(--fg-muted)]">
                <Link href={`/learn/paths/${path.slug}`} className="hover:text-[#7D288F] dark:hover:text-purple-300">
                  {strings.learningPath}
                </Link>
                <span aria-hidden="true">/</span>
                <Link href={`/learn/${course.slug}`} className="hover:text-[#7D288F] dark:hover:text-purple-300">
                  {localizedCourse.title}
                </Link>
                <span aria-hidden="true">/</span>
                <span>{currentModule.title}</span>
              </nav>
              <LessonNavigation
                courseSlug={course.slug}
                courseTitle={localizedCourse.title}
                currentModuleId={currentModule.id}
                currentLessonId={lesson.id}
                modules={navigationModules}
              />
            </div>

            <header className="border-b border-[var(--border)] pb-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7D288F] dark:text-purple-300">
                  {strings.levels[currentModule.level]}
                </span>
                <span className="text-xs text-[var(--fg-muted)]">
                  {lesson.estimated_minutes} {strings.minutesRead}
                </span>
                {lesson.lesson_type !== "lesson" && (
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--fg-muted)]">
                    {strings.lessonTypes[lesson.lesson_type]}
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
                {localizedLesson.title}
              </h1>
              <RichContent
                content={studyMaterial.introduction}
                className="mt-3 text-[var(--fg-muted)] [&_p]:text-[var(--fg-muted)]"
              />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <AskAIMentorButton
                  context={{
                    learning_path_id: path.id,
                    learning_path: localizedPath.title,
                    course_id: course.id,
                    course: localizedCourse.title,
                    module_id: currentModule.id,
                    module: currentModule.title,
                    lesson_id: lesson.id,
                    lesson_level: `${currentModule.level[0].toUpperCase()}${currentModule.level.slice(1)}`,
                    lesson: localizedLesson.title,
                  }}
                />
              </div>
              <LessonProgress
                status={lessonStatus}
                completedLessons={completedLessons}
                totalLessons={orderedLessons.length}
              />
            </header>

            <LessonStudyGuide
              material={studyMaterial}
              publishedNote={localizedLesson.content || localizedLesson.explanation}
              examples={localizedLesson.examples}
              codeExamples={localizedLesson.code_examples}
              notes={localizedLesson.notes}
              commonMistakes={localizedLesson.common_mistakes}
              practice={localizedLesson.practice}
            />
            <LessonQuiz
              lessonId={lesson.id}
              questions={quizQuestions}
              savedScore={currentProgress?.quiz_score ?? null}
            />
            <CompleteLessonButton
              lessonId={lesson.id}
              initiallyCompleted={lessonStatus === "completed"}
              requiresQuiz={quizQuestions.length > 0}
              nextHref={nextHref}
            />
          </div>
        </div>
      </div>

      <LessonPager
        courseSlug={course.slug}
        previous={previousLesson ? {
          href: `/learn/${course.slug}/${previousLesson.module.slug}/${previousLesson.slug}`,
          title: previousLesson.title,
        } : null}
        next={nextLesson ? {
          href: nextHref ?? `/learn/${course.slug}/${nextLesson.module.slug}/${nextLesson.slug}`,
          title: nextLesson.title,
        } : null}
        completed={lessonStatus === "completed"}
      />
    </div>
  );
}
