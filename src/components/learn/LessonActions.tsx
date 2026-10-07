"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLesson, startLearningPath } from "@/app/actions/learning";
import AIMentorChat from "@/components/learn/AIMentorChat";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

type MentorContext = {
  learning_path_id: string;
  learning_path: string;
  course_id: string;
  course: string;
  module_id: string;
  module: string;
  lesson_id: string;
  lesson: string;
  lesson_level: string;
  user_id: string;
};

export function AskAIMentorButton({
  context,
  codeContext,
}: {
  context: Omit<MentorContext, "user_id">;
  codeContext?: {
    lessonTitle?: string;
    explanation?: string;
    code?: string;
    language?: string;
    output?: string;
    preview?: string;
    mode?: "javascript" | "html-css";
  };
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  function toggleMentor() {
    if (!user) {
      setError(t("appShell.lessonAI.signInError"));
      return;
    }
    setError("");
    setOpen((current) => !current);
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="lesson-ai-mentor"
        onClick={toggleMentor}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7D288F] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#681f78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]"
      >
        <span aria-hidden="true">✦</span>
        {t("appShell.lessonAI.open")}
      </button>
      {error && <p role="alert" className="mt-2 text-xs font-medium text-red-500">{error}</p>}
      {open && (
        <div id="lesson-ai-mentor" className="mt-5 w-full lg:max-w-2xl">
          <AIMentorChat initialContext={context} onClose={() => setOpen(false)} codeContext={codeContext} />
        </div>
      )}
    </div>
  );
}

export function StartLearningButton({
  pathId,
  href,
  enrolled,
}: {
  pathId: string;
  href: string;
  enrolled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <div className="shrink-0">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError("");
          startTransition(async () => {
            const result = await startLearningPath(pathId);
            if (result.error) {
              setError(result.error);
              return;
            }
            router.push(href);
          });
        }}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#7D288F] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#681f78] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]"
      >
        {pending ? "Loading..." : enrolled ? "Continue Learning" : "Start Learning"}
        {!pending && <span aria-hidden="true">→</span>}
      </button>
      {error && <p role="alert" className="mt-2 max-w-xs text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function CompleteLessonButton({
  lessonId,
  initiallyCompleted,
  requiresQuiz,
  nextHref,
}: {
  lessonId: string;
  initiallyCompleted: boolean;
  requiresQuiz: boolean;
  nextHref: string | null;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function complete() {
    setError("");
    startTransition(async () => {
      const result = await completeLesson(lessonId);
      if (result.error) {
        if ("lessonCompleted" in result && result.lessonCompleted) {
          setCompleted(true);
          router.refresh();
        }
        setError(result.error);
        return;
      }
      setCompleted(true);
      router.refresh();
    });
  }

  return (
    <div id="lesson-complete" className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      {completed ? (
        <>
          <p role="status" className="font-bold text-emerald-700 dark:text-emerald-300">
            ✓ {t("appShell.lessonContent.completedMessage")}
          </p>
          {nextHref && (
            <Link
              href={nextHref}
              prefetch={false}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#7D288F] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#681f78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]"
            >
              {t("appShell.lessonContent.continue")} <span aria-hidden="true">→</span>
            </Link>
          )}
        </>
      ) : (
        <>
          <p className="mb-3 text-sm text-[var(--fg-muted)]">
            {requiresQuiz
              ? t("appShell.lessonContent.quizPrompt")
              : t("appShell.lessonContent.completionPrompt")}
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={complete}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#7D288F] px-5 py-3 text-sm font-bold text-[#7D288F] transition-colors hover:bg-[var(--brand-soft)] disabled:cursor-wait disabled:opacity-60 dark:text-purple-300"
          >
            {pending ? t("appShell.lessonContent.saving") : t("appShell.lessonContent.complete")}
          </button>
        </>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
