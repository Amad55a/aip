import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/supabase/database.types";
import { LessonStatus, type LessonState } from "@/components/learn/LessonStatus";
import { getServerLanguage } from "@/lib/i18n/server-language";
import { translations } from "@/i18n";
import ContentLanguageFallbackNotice from "@/components/app/ContentLanguageFallbackNotice";
import { calculateProgress } from "@/lib/learning/progress";

type LessonSummary = Pick<
  Lesson,
  "id" | "module_id" | "slug" | "title" | "lesson_type" | "order_index"
>;

const LEVELS = ["basic", "intermediate", "advanced"] as const;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const language = await getServerLanguage();
  const strings = translations[language].appShell.learn;
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
    .select("id,slug,title,description,level,estimated_hours,order_index,translations")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("order_index");

  if (modulesError) {
    throw new Error(`Unable to load ${localizedCourse.title} modules: ${modulesError.message}`);
  }
  const localizedModules = modules.map((module) => ({
    ...module,
    title: module.translations[language]?.title ?? module.title,
    description: module.translations[language]?.description ?? module.description,
  }));

  let lessons: LessonSummary[] = [];
  if (localizedModules.length > 0) {
    const { data, error } = await supabase
      .from("lessons")
      .select("id,module_id,slug,title,lesson_type,order_index,translations")
      .in("module_id", localizedModules.map((module) => module.id))
      .eq("is_published", true)
      .order("order_index");

    if (error) {
      throw new Error(`Unable to load ${localizedCourse.title} lessons: ${error.message}`);
    }
    lessons = data.map((lesson) => ({
      ...lesson,
      title: lesson.translations[language]?.title ?? lesson.title,
    }));
  }

  const totalLessons = lessons.length;
  const totalProjects = lessons.filter((lesson) => lesson.lesson_type === "project").length;
  const totalHours = localizedModules.reduce((sum, module) => sum + module.estimated_hours, 0);
  const lessonStates: Record<string, LessonState> = {};
  if (lessons.length > 0) {
    const { data: progress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("lesson_id,status")
      .eq("user_id", user.id);
    if (progressError) {
      throw new Error(`Unable to load lesson progress: ${progressError.message}`);
    }
    const progressByLesson = new Map(progress.map((item) => [item.lesson_id, item.status]));
    for (const lesson of lessons) {
      lessonStates[lesson.id] = progressByLesson.get(lesson.id) ?? "not_started";
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 pb-28 sm:px-8 sm:py-10 md:pb-12">
      <Link
        href={`/learn/paths/${path.slug}`}
        className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-[var(--fg-muted)] hover:text-[#7D288F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7D288F] dark:hover:text-purple-300"
      >
        <span aria-hidden="true">←</span>
        {localizedPath.title}
      </Link>

      <header className="mt-6 rounded-3xl border border-[var(--brand-border)] bg-[#21192b] p-6 text-white shadow-sm sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
          {localizedPath.title}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {localizedCourse.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
          {localizedCourse.description}
        </p>
        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
          <CourseStat label={strings.estimatedTime} value={`${totalHours} ${strings.hours}`} />
          <CourseStat label={strings.lessons} value={String(totalLessons)} />
          <CourseStat label={strings.projects} value={String(totalProjects)} />
        </div>
      </header>

      <div className="mt-6">
        <ContentLanguageFallbackNotice contentType="learning" />
      </div>

      <section className="mt-10" aria-labelledby="roadmap-title">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7D288F] dark:text-purple-300">
            {strings.courseRoadmap}
          </p>
          <h2 id="roadmap-title" className="mt-2 text-2xl font-extrabold text-[var(--fg)]">
            {strings.courseJourney}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">
            {strings.courseJourneyDescription}
          </p>
        </div>

        {localizedModules.length === 0 ? (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--fg-muted)]">
            {strings.emptyCurriculum}
          </p>
        ) : (
          <div className="space-y-9">
            {LEVELS.map((level) => {
              const levelModules = localizedModules.filter((module) => module.level === level);
              return (
                <section key={level} aria-labelledby={`level-${level}`}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-[var(--border)]" />
                    <h3
                      id={`level-${level}`}
                      className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--fg-muted)]"
                    >
                      {strings.levels[level]}
                    </h3>
                    <span className="h-px flex-1 bg-[var(--border)]" />
                  </div>

                  {levelModules.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--fg-muted)]">
                      {strings.noLessonsAtLevel}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {levelModules.map((module) => {
                        const moduleLessons = lessons.filter(
                          (lesson) => lesson.module_id === module.id
                        );
                        const completedLessons = moduleLessons.filter(
                          (lesson) => lessonStates[lesson.id] === "completed"
                        ).length;
                        const { percent: moduleProgress } = calculateProgress(
                          completedLessons,
                          moduleLessons.length
                        );
                        return (
                          <article
                            key={module.id}
                            id={`module-${module.slug}`}
                            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
                              <div>
                                <h4 className="text-lg font-bold text-[var(--fg)]">
                                  {module.title}
                                </h4>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--fg-muted)]">
                                  {module.description}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--fg-muted)]">
                                {strings.moduleLessonCount
                                  .replace("{hours}", String(module.estimated_hours))
                                  .replace("{lessons}", String(moduleLessons.length))}
                              </span>
                            </div>
                            <div className="px-5 pb-4 sm:px-6">
                              <div className="flex justify-between text-xs text-[var(--fg-muted)]">
                                <span>{strings.lessonsCompletedCount
                                  .replace("{completed}", String(completedLessons))
                                  .replace("{total}", String(moduleLessons.length))}</span>
                                <span>{moduleProgress}%</span>
                              </div>
                              <div
                                role="progressbar"
                                aria-label={strings.progressAriaLabel.replace("{module}", module.title)}
                                aria-valuenow={moduleProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]"
                              >
                                <div
                                  className="h-full rounded-full bg-[#7D288F] transition-all"
                                  style={{ width: `${moduleProgress}%` }}
                                />
                              </div>
                            </div>
                            {moduleLessons.length > 0 ? (
                              <ol className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                                {moduleLessons.map((lesson, index) => (
                                  <li key={lesson.id}>
                                    <Link
                                      href={`/learn/${course.slug}/${module.slug}/${lesson.slug}`}
                                      prefetch={false}
                                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#7D288F] sm:px-6"
                                    >
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] font-mono text-xs font-bold text-[var(--fg-muted)] transition-colors group-hover:border-[#7D288F] group-hover:text-[#7D288F] dark:group-hover:text-purple-300">
                                        {String(index + 1).padStart(2, "0")}
                                      </span>
                                      <LessonStatus status={lessonStates[lesson.id] ?? "not_started"} compact />
                                      <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--fg)]">
                                        {lesson.title}
                                      </span>
                                      {lesson.lesson_type === "project" && (
                                        <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7D288F] dark:text-purple-300">
                                          {strings.project}
                                        </span>
                                      )}
                                      <span
                                        aria-hidden="true"
                                        className="text-[var(--fg-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[#7D288F] rtl:rotate-180"
                                      >
                                        →
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ol>
                            ) : (
                              <p className="border-t border-[var(--border)] px-5 py-4 text-sm text-[var(--fg-muted)]">
                                {strings.noPublishedLessons}
                              </p>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function CourseStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-white/60">{label}</p>
      <p className="mt-1 text-lg font-extrabold">{value}</p>
    </div>
  );
}
