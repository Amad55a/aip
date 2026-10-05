"use client";

import { useLanguage } from "@/hooks/useLanguage";
import type { LessonState } from "@/components/learn/LessonStatus";
import { calculateProgress } from "@/lib/learning/progress";

export default function LessonProgress({
  status,
  completedLessons,
  totalLessons,
}: {
  status: LessonState;
  completedLessons: number;
  totalLessons: number;
}) {
  const { t } = useLanguage();
  const { completed, total, percent } = calculateProgress(completedLessons, totalLessons);
  const progressLabel = t("appShell.lessonContent.progressValue")
    .replace("{completed}", String(completed))
    .replace("{total}", String(total))
    .replace("{percent}", String(percent));
  const statusLabel = t(`appShell.lessonContent.${status === "not_started" ? "notStarted" : status === "in_progress" ? "inProgress" : "completed"}`);

  return (
    <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4" aria-label={t("appShell.lessonContent.lessonStatus")}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[var(--fg)]">{t("appShell.lessonContent.progress")}</span>
        <span className="text-[var(--fg-muted)]">{progressLabel}</span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]"
        role="progressbar"
        aria-label={t("appShell.lessonContent.progress")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-[#7D288F] transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <span className="text-[var(--fg-muted)]">{t("appShell.lessonContent.lessonStatus")}</span>
        <span className="inline-flex items-center gap-2 font-semibold text-[#7D288F] dark:text-purple-300">
          <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full border border-[#7D288F]/30 text-[10px]">
            {status === "completed" ? "✓" : status === "in_progress" ? "→" : "○"}
          </span>
          {statusLabel}
        </span>
      </div>
    </section>
  );
}
