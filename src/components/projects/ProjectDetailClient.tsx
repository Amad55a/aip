"use client";

import Link from "next/link";
import { useState } from "react";
import ContentLanguageFallbackNotice from "@/components/app/ContentLanguageFallbackNotice";
import RichContent from "@/components/content/RichContent";
import { useLanguage } from "@/hooks/useLanguage";
import { useAIDailyUsage } from "@/hooks/useAIDailyUsage";
import { getLocalizedProject, type Project } from "@/lib/projects";

export default function ProjectDetailClient({
  project,
  initialCompleted,
}: {
  project: Project;
  initialCompleted: boolean;
}) {
  const { language, t } = useLanguage();
  const {
    usage,
    loading: usageLoading,
    unavailable: usageUnavailable,
    signInRequired,
    updateFromResponse,
  } = useAIDailyUsage();
  const localizedProject = getLocalizedProject(project, language);
  const [completed, setCompleted] = useState(initialCompleted);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCompletion() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/projects/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, slug: project.slug }),
      });

      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : t("appShell.projectDetail.completionError");
        throw new Error(message);
      }

      setCompleted(true);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : t("appShell.projectDetail.completionError");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAskMentor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || usageLoading || usageUnavailable || usage?.remaining === 0) return;

    setError("");
    setAnswer("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ai/project-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: project.slug, question: trimmed, language }),
      });

      const result: unknown = await response.json();
      updateFromResponse(result);
      if (!response.ok) {
        const message =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : t("appShell.projectDetail.mentorError");
        throw new Error(message);
      }

      if (typeof result !== "object" || result === null || !("answer" in result) || typeof result.answer !== "string") {
        throw new Error(t("appShell.projectDetail.mentorError"));
      }

      setAnswer(result.answer);
      setQuestion("");
    } catch (mentorError) {
      const message =
        mentorError instanceof Error ? mentorError.message : t("appShell.projectDetail.mentorError");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 pb-24 sm:px-8 sm:py-10 md:pb-10">
      <Link href="/projects" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7D288F] hover:text-[#681f78]">
        <span aria-hidden="true">←</span>
        <span>{t("appShell.projectDetail.backToProjects")}</span>
      </Link>

      <ContentLanguageFallbackNotice
        contentType="project"
        isTranslated={language === "en" || localizedProject.title !== project.title}
      />

      <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7D288F] dark:text-purple-300">
              {project.category === "mern"
                ? t("appShell.projectLibrary.categories.mern")
                : t("appShell.projectLibrary.categories.html")}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--fg)]">{localizedProject.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--fg-muted)]">{localizedProject.longDescription}</p>
          </div>

          <div className="flex flex-col items-start gap-3">
            <span className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-sm font-medium text-[var(--fg)]">
              {t(`appShell.projectLibrary.difficulty.${project.difficulty}`)}
            </span>
            {completed && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                ✓ {t("appShell.projectDetail.projectCompleted")}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span key={`${project.id}-${technology}`} className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-sm font-medium text-[var(--fg-muted)]">
              {technology}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCompletion}
            disabled={completed || isSubmitting}
            className={[
              "inline-flex min-h-12 items-center gap-2.5 rounded-xl border px-5 py-3 text-sm font-semibold transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
              completed
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                : "border-[#7D288F] bg-[#7D288F] text-white shadow-sm shadow-[#7D288F]/20 hover:-translate-y-0.5 hover:bg-[#681f78] hover:shadow-md focus-visible:ring-[#7D288F] disabled:cursor-wait disabled:opacity-70",
            ].join(" ")}
          >
            {completed ? (
              <>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500" aria-hidden="true">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 10 3.2 3.2L15 6.5" />
                  </svg>
                </span>
                <span>{t("appShell.projectDetail.projectCompleted")}</span>
              </>
            ) : (
              <>
                <span>{isSubmitting ? t("appShell.projectDetail.saving") : t("appShell.projectDetail.markCompleted")}</span>
                {!isSubmitting && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m4 10 4 4 8-8" />
                  </svg>
                )}
              </>
            )}
          </button>

          <a
            href="#ask-ai-mentor"
            className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-semibold text-[var(--fg)] transition hover:border-[#7D288F]/60 hover:text-[#7D288F]"
          >
            {t("appShell.projectDetail.askForGuidance")}
          </a>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </article>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-8">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg)]">{t("appShell.projectDetail.whatYouBuild")}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--fg-muted)]">
              {localizedProject.whatYouWillBuild.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7D288F]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg)]">{t("appShell.projectDetail.whatYouLearn")}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--fg-muted)]">
              {localizedProject.whatYouWillLearn.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7D288F]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg)]">{t("appShell.projectDetail.requirements")}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--fg-muted)]">
              {localizedProject.requirements.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[#7D288F]" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg)]">{t("appShell.projectDetail.suggestedSteps")}</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--fg-muted)]">
              {localizedProject.suggestedSteps.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="font-semibold text-[var(--fg)]">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <aside className="space-y-6">
          <div id="ask-ai-mentor" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg)]">{t("appShell.projectDetail.guidanceTitle")}</h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              {t("appShell.projectDetail.projectLabel")}: {localizedProject.title}
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {t("appShell.projectDetail.technologies")}: {project.technologies.join(", ")}
            </p>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {t("appShell.projectDetail.difficulty")}: {t(`appShell.projectLibrary.difficulty.${project.difficulty}`)}
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-[#7D288F] dark:text-purple-300">
              {t("appShell.projectDetail.guidanceOnly")}
            </p>

            <form onSubmit={handleAskMentor} className="mt-4 space-y-4">
              {usage && (
                <p className="text-xs font-semibold text-[var(--fg-muted)]" role="status">
                  {usage.remaining > 0
                    ? t("appShell.aiUsage.remaining").replace("{count}", String(usage.remaining))
                    : t("appShell.aiUsage.limitReached").replace("{limit}", String(usage.limit))}
                </p>
              )}
              {(usageUnavailable || signInRequired) && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {t(signInRequired ? "appShell.aiUsage.signInRequired" : "appShell.aiUsage.loadingError")}
                </p>
              )}
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={5}
                placeholder={t("appShell.projectDetail.questionPlaceholder")}
                disabled={usageLoading || usageUnavailable || signInRequired || usage?.remaining === 0}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 text-sm text-[var(--fg)] outline-none transition focus:border-[#7D288F] focus:ring-2 focus:ring-[#7D288F]/20"
              />
              <button
                type="submit"
                disabled={isSubmitting || usageLoading || usageUnavailable || signInRequired || usage?.remaining === 0 || !question.trim()}
                className="w-full rounded-xl bg-[#7D288F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#681f78] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? t("appShell.projectDetail.thinking") : t("appShell.projectDetail.getGuidance")}
              </button>
            </form>

            {answer && (
              <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm leading-7 text-[var(--fg)]">
                <RichContent content={answer} />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg)]">{t("appShell.projectDetail.relatedLearning")}</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--fg-muted)]">
              {localizedProject.relatedLearning.map((item) => (
                <li key={item}>→ {item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
