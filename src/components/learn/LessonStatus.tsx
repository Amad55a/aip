"use client";

import type { LessonProgress } from "@/lib/supabase/database.types";
import { useLanguage } from "@/hooks/useLanguage";

export type LessonState = LessonProgress["status"] | "not_started";

export function LessonStatus({
  status,
  compact = false,
}: {
  status: LessonState;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const label = t(`appShell.lessonNavigation.status.${status}`);
  const icon = status === "completed" ? "✓" : status === "in_progress" ? "→" : "○";
  const color = "text-[#7D288F] dark:text-purple-300";

  return (
    <span
      aria-label={label}
      className={`inline-flex items-center gap-1.5 ${color}`}
      title={label}
    >
      <span aria-hidden="true" className="font-bold">{icon}</span>
      {!compact && <span>{label}</span>}
    </span>
  );
}
