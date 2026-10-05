"use client";

import Link from "next/link";
import type { Course, Lesson, LearningPath, Module } from "@/lib/supabase/database.types";
import { useLanguage } from "@/hooks/useLanguage";
import ContentLanguageFallbackNotice from "@/components/app/ContentLanguageFallbackNotice";
import { LessonStatus, type LessonState } from "@/components/learn/LessonStatus";
import { StartLearningButton } from "@/components/learn/LessonActions";
import { calculateProgress } from "@/lib/learning/progress";

type CurriculumLesson = Pick<Lesson, "id" | "module_id" | "slug" | "title" | "lesson_type">;
type CurriculumModule = Pick<
  Module,
  "id" | "course_id" | "slug" | "title" | "description" | "level" | "estimated_hours"
> & { lessons: CurriculumLesson[] };
type CourseWithModules = Pick<
  Course,
  "id" | "title" | "slug" | "description" | "order_index"
> & {
  modules: CurriculumModule[];
};

type Stage = {
  key: "foundations" | "intermediate" | "advanced";
  courses: CourseWithModules[];
};

const STAGE_BOUNDARIES = [
  { key: "foundations", lastOrder: 4 },
  { key: "intermediate", lastOrder: 11 },
  { key: "advanced", lastOrder: Number.POSITIVE_INFINITY },
] as const;

function CodeMark() {
  return (
    <div
      aria-hidden="true"
      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 font-mono text-xl font-bold tracking-tight text-white shadow-inner"
    >
      &lt;/&gt;
    </div>
  );
}

export default function LearnRoadmap({
  path,
  courses,
  lessonStates,
  enrolled,
  startHref,
}: {
  path: LearningPath | null;
  courses: CourseWithModules[];
  lessonStates: Record<string, LessonState>;
  enrolled: boolean;
  startHref: string;
}) {
  const { t } = useLanguage();
  const formatLessonProgress = (completed: number, total: number, percent: number) =>
    t("appShell.lessonContent.progressValue")
      .replace("{completed}", String(completed))
      .replace("{total}", String(total))
      .replace("{percent}", String(percent));

  if (!path) {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
            {t("appShell.nav.learn")}
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--fg)]">
            {t("appShell.learn.unavailableTitle")}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--fg-muted)]">
            {t("appShell.learn.unavailableBody")}
          </p>
        </div>
      </div>
    );
  }

  const moduleCount = courses.reduce((total, course) => total + course.modules.length, 0);
  const lessons = courses.flatMap((course) =>
    course.modules.flatMap((module) => module.lessons)
  );
  const completedLessons = lessons.filter(
    (lesson) => lessonStates[lesson.id] === "completed"
  ).length;
  const { percent: pathProgress } = calculateProgress(completedLessons, lessons.length);
  const projectCount = lessons.filter((lesson) => lesson.lesson_type === "project").length;
  const stages: Stage[] = STAGE_BOUNDARIES.map((stage, index) => ({
    key: stage.key,
    courses: courses.filter(
      (course) =>
        course.order_index <= stage.lastOrder &&
        (index === 0 ||
          course.order_index > STAGE_BOUNDARIES[index - 1].lastOrder)
    ),
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 pb-28 sm:px-8 sm:py-10 md:pb-12">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {t("appShell.nav.learn")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
          {t("appShell.learn.pageTitle")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--fg-muted)]">
          {t("appShell.learn.pageDescription")}
        </p>
      </header>

      <div className="mb-6">
        <ContentLanguageFallbackNotice contentType="learning" />
      </div>

      <section className="relative isolate overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-[#21192b] p-6 text-white shadow-sm sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-12 -top-28 -z-10 h-80 w-80 rounded-full bg-[#a43eb5]/30 blur-3xl"
        />
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-purple-200">
              {t("appShell.learn.pathEyebrow")}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {path.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
              {path.short_description ?? path.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/85">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                {t("appShell.learn.beginner")}
              </span>
              <span aria-hidden="true" className="text-purple-200">→</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                {t("appShell.learn.intermediate")}
              </span>
              <span aria-hidden="true" className="text-purple-200">→</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                {t("appShell.learn.advanced")}
              </span>
            </div>
          </div>
          <div className="hidden shrink-0 sm:block">
            <CodeMark />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/15 pt-6 sm:grid-cols-4">
          <PathStat
            label={t("appShell.learn.estimatedTime")}
            value={`${path.estimated_hours} ${t("appShell.learn.hours")}`}
          />
          <PathStat
            label={t("appShell.learn.modules")}
            value={moduleCount.toLocaleString()}
          />
          <PathStat
            label={t("appShell.learn.lessons")}
            value={lessons.length.toLocaleString()}
          />
          <PathStat
            label={t("appShell.learn.projects")}
            value={projectCount.toLocaleString()}
          />
        </div>
      </section>

      <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h3 className="font-bold text-[var(--fg)]">
            {t("appShell.learn.progressionTitle")}
          </h3>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {enrolled
              ? formatLessonProgress(completedLessons, lessons.length, pathProgress)
              : t("appShell.learn.progressionBody")}
          </p>
          {enrolled && (
            <div
              role="progressbar"
              aria-label={t("appShell.learn.progressionTitle")}
              aria-valuenow={pathProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-2 h-2 max-w-sm overflow-hidden rounded-full bg-[var(--border)]"
            >
              <div className="h-full rounded-full bg-[#7D288F]" style={{ width: `${pathProgress}%` }} />
            </div>
          )}
        </div>
        {lessons.length ? (
          <StartLearningButton pathId={path.id} href={startHref} enrolled={enrolled} />
        ) : (
          <p className="max-w-xs text-sm text-[var(--fg-muted)]">
            {t("appShell.learn.curriculumComingSoon")}
          </p>
        )}
      </div>

      <section id="curriculum" className="mt-12 scroll-mt-8">
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7D288F] dark:text-purple-300">
            {t("appShell.learn.curriculumEyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--fg)]">
            {t("appShell.learn.curriculumTitle")}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fg-muted)]">
            {path.description}
          </p>
        </div>

        {courses.length === 0 ? (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--fg-muted)]">
            {t("appShell.learn.emptyCurriculum")}
          </p>
        ) : (
          <div className="space-y-9">
            {stages.map((stage, stageIndex) => (
              <section key={stage.key} aria-labelledby={`stage-${stage.key}`}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-extrabold text-[#7D288F] dark:text-purple-300">
                    0{stageIndex + 1}
                  </span>
                  <div>
                    <h3
                      id={`stage-${stage.key}`}
                      className="text-lg font-extrabold text-[var(--fg)]"
                    >
                      {t(`appShell.learn.stages.${stage.key}`)}
                    </h3>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {stage.courses.length} {t("appShell.learn.technologies")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-s-2 border-[var(--border)] ps-4 sm:ms-4 sm:ps-6">
                  {stage.courses.map((course) => {
                    const courseLessonCount = course.modules.reduce(
                      (total, module) => total + module.lessons.length,
                      0
                    );
                    return (
                      <details
                        id={`course-${course.slug}`}
                        key={course.id}
                        open={course.order_index === 1}
                        className="group scroll-mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-4 marker:hidden transition-colors hover:bg-[var(--bg-subtle)] [&::-webkit-details-marker]:hidden">
                          <span className="flex min-w-0 items-start gap-3">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-subtle)] font-mono text-xs font-bold text-[var(--fg-muted)]">
                              {String(course.order_index).padStart(2, "0")}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-bold text-[var(--fg)]">
                                <Link
                                  href={`/learn/${course.slug}`}
                                  className="rounded-sm hover:text-[#7D288F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] dark:hover:text-purple-300"
                                >
                                  {course.title}
                                </Link>
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-[var(--fg-muted)]">
                                {course.description}
                              </span>
                              <span className="mt-2 block text-xs font-medium text-[var(--fg-muted)]">
                                {course.modules.length} {t("appShell.learn.modules")} · {courseLessonCount} {t("appShell.learn.lessons")}
                              </span>
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-lg text-[var(--fg-muted)] transition-transform group-open:rotate-180"
                          >
                            ⌄
                          </span>
                        </summary>
                        <div className="space-y-3 border-t border-[var(--border)] p-4 sm:p-5">
                          {course.modules.map((module) => (
                            <div
                              key={module.id}
                              className="rounded-lg bg-[var(--bg-subtle)] p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-bold text-[var(--fg)]">
                                  {module.title}
                                </h4>
                                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--fg-muted)]">
                                  {t(`appShell.learn.levels.${module.level}`)}
                                </span>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-[var(--fg-muted)]">
                                {module.description}
                              </p>
                              {module.lessons.length > 0 && (() => {
                                const completed = module.lessons.filter(
                                  (lesson) => lessonStates[lesson.id] === "completed"
                                ).length;
                                const { percent } = calculateProgress(completed, module.lessons.length);
                                return (
                                  <div className="mt-3">
                                    <div className="flex justify-between text-[11px] text-[var(--fg-muted)]">
                                      <span>{formatLessonProgress(completed, module.lessons.length, percent)}</span>
                                      <span>{percent}%</span>
                                    </div>
                                    <div
                                      role="progressbar"
                                      aria-label={`${module.title} progress`}
                                      aria-valuenow={percent}
                                      aria-valuemin={0}
                                      aria-valuemax={100}
                                      className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
                                    >
                                      <div className="h-full rounded-full bg-[#7D288F]" style={{ width: `${percent}%` }} />
                                    </div>
                                  </div>
                                );
                              })()}
                              <ol className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <li
                                    key={lesson.id}
                                    className="flex items-start gap-2 text-xs leading-5 text-[var(--fg)]"
                                  >
                                    <span className="mt-0.5 w-5 shrink-0 text-end font-mono text-[10px] text-[var(--fg-muted)]">
                                      {String(lessonIndex + 1).padStart(2, "0")}
                                    </span>
                                    <LessonStatus status={lessonStates[lesson.id] ?? "not_started"} compact />
                                    <Link
                                      href={`/learn/${course.slug}/${module.slug}/${lesson.slug}`}
                                      prefetch={false}
                                      className="rounded-sm hover:text-[#7D288F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] dark:hover:text-purple-300"
                                    >
                                      {lesson.title}
                                      {lesson.lesson_type === "project" && (
                                        <span className="ms-2 rounded bg-[var(--brand-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[#7D288F] dark:text-purple-300">
                                          {t("appShell.learn.project")}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PathStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-white/60">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-white">{value}</p>
    </div>
  );
}
