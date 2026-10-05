"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { calculateProgress } from "@/lib/learning/progress";

type CurrentLearningPath = {
  title: string;
  completedLessons: number;
  totalLessons: number;
  href: string;
} | null;

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--border)]"
    >
      <div className="h-full rounded-full bg-[#7D288F] transition-all duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CurrentProgress({ learningPath }: { learningPath: CurrentLearningPath }) {
  const { t } = useLanguage();
  const { completed, total, percent } = calculateProgress(
    learningPath?.completedLessons ?? 0,
    learningPath?.totalLessons ?? 0
  );

  return (
    <section aria-labelledby="progress-heading">
      <h2
        id="progress-heading"
        className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)]"
      >
        {t("appShell.progress.heading")}
      </h2>
      {!learningPath ? (
        <p className="text-sm text-[var(--fg-muted)]">
          Start the Web Development / MERN Stack path to see your progress here.
        </p>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--fg)]">{learningPath.title}</p>
              <p className="mt-0.5 text-xs text-[var(--fg-muted)]">
                {completed} / {total}{" "}
                {t("appShell.progress.lessonsCompleted")}
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-[#7D288F] dark:text-purple-400">
              {percent}%
            </span>
          </div>
          <div className="mt-4"><ProgressBar value={percent} /></div>
          <Link
            href={learningPath.href}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#7D288F] hover:underline dark:text-purple-400"
          >
            {t("appShell.progress.continueCta")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
