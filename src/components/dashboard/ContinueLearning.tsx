"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { StartLearningButton } from "@/components/learn/LessonActions";

type ContinueData = {
  pathId: string;
  pathTitle: string;
  enrolled: boolean;
  courseTitle: string | null;
  moduleTitle: string | null;
  lessonTitle: string | null;
  href: string;
} | null;

export default function ContinueLearning({ data }: { data: ContinueData }) {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="continue-heading">
      <h2
        id="continue-heading"
        className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)]"
      >
        {t("appShell.continueLearning.heading")}
      </h2>
      {!data ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--fg-muted)]">The Web Development learning path is currently unavailable.</p>
        </div>
      ) : !data.enrolled ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">
            Start your Web Development journey
          </p>
          <h3 className="mt-2 text-base font-bold text-[var(--fg)]">{data.pathTitle}</h3>
          <div className="mt-5">
            <StartLearningButton pathId={data.pathId} href={data.href} enrolled={false} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--fg-muted)]">
            Current Learning Path
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--fg)]">{data.pathTitle}</p>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)]">
            Continue Learning
          </h3>
          {data.lessonTitle ? (
            <>
              <p className="mt-2 text-sm font-semibold text-[var(--fg-muted)]">
                {data.courseTitle}{data.moduleTitle ? ` · ${data.moduleTitle}` : ""}
              </p>
              <p className="mt-1 text-base font-bold text-[var(--fg)]">{data.lessonTitle}</p>
              <p className="mt-1 text-sm text-[var(--fg-muted)]">
                {t("appShell.continueLearning.readyLine")}
              </p>
              <div className="mt-5">
                <StartLearningButton pathId={data.pathId} href={data.href} enrolled />
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              {t("appShell.continueLearning.noLesson")}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
