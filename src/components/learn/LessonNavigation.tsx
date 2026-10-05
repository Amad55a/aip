"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LessonStatus, type LessonState } from "@/components/learn/LessonStatus";
import { useLanguage } from "@/hooks/useLanguage";

type NavigationModule = {
  id: string;
  slug: string;
  title: string;
  lessons: {
    id: string;
    slug: string;
    title: string;
    status: LessonState;
  }[];
};

export default function LessonNavigation({
  courseSlug,
  courseTitle,
  currentModuleId,
  currentLessonId,
  modules,
}: {
  courseSlug: string;
  courseTitle: string;
  currentModuleId: string;
  currentLessonId: string;
  modules: NavigationModule[];
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const currentModule = modules.find((module) => module.id === currentModuleId);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function closeOnOutsideClick(event: MouseEvent) {
      if (!(event.target instanceof Node) || !navigationRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [open]);

  return (
    <>
      <div ref={navigationRef} className="relative inline-flex max-w-full">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-start text-xs font-semibold text-[var(--fg)] transition-colors hover:border-[#7D288F]/50 hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
        >
          <span className="min-w-0 truncate">{currentModule?.title ?? courseTitle} · {t("appShell.lessonNavigation.lessons")}</span>
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" />
          </svg>
        </button>

        {open && (
          <div
            className="fixed inset-0 z-[60] flex items-end bg-black/45 p-0 sm:absolute sm:inset-auto sm:end-0 sm:top-full sm:mt-2 sm:block sm:w-[min(36rem,calc(100vw-2rem))] sm:bg-transparent sm:p-0"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <section
              role="dialog"
              aria-labelledby="lesson-navigation-title"
              className="flex max-h-[86vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl sm:max-h-[min(80vh,760px)] sm:rounded-2xl"
            >
              <header className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7D288F] dark:text-purple-300">
                    {courseTitle}
                  </p>
                  <h2 id="lesson-navigation-title" className="mt-1 text-lg font-bold text-[var(--fg)]">
                    {t("appShell.lessonNavigation.title")}
                  </h2>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("appShell.lessonNavigation.close")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m5 5 10 10M15 5 5 15" />
                  </svg>
                </button>
              </header>
              <nav aria-label={t("appShell.lessonNavigation.title")} className="overflow-y-auto p-4 sm:p-5">
                <ol className="space-y-5">
                  {modules.map((module) => (
                    <li key={module.id}>
                      <h3 className="mb-2 rounded-lg bg-[var(--bg-subtle)] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--fg-muted)]">
                        {module.title}
                      </h3>
                      <ol className="space-y-1">
                        {module.lessons.map((lesson) => {
                          const current = lesson.id === currentLessonId;
                          return (
                            <li key={lesson.id}>
                              <Link
                                href={`/learn/${courseSlug}/${module.slug}/${lesson.slug}`}
                                prefetch={false}
                                onClick={() => setOpen(false)}
                                aria-current={current ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#7D288F] ${
                                  current
                                    ? "border-[#7D288F]/30 bg-[var(--brand-soft)] font-semibold text-[#7D288F] dark:text-purple-300"
                                    : "border-transparent text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                                }`}
                              >
                                <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#7D288F]/30 text-xs font-bold text-[#7D288F] dark:text-purple-300">
                                  {lesson.status === "completed" ? "✓" : lesson.status === "in_progress" ? "→" : "○"}
                                </span>
                                <span className="min-w-0 flex-1">{lesson.title}</span>
                                <LessonStatus status={lesson.status} />
                              </Link>
                            </li>
                          );
                        })}
                      </ol>
                    </li>
                  ))}
                </ol>
              </nav>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
