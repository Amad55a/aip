"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  submitLessonQuiz,
  type QuizAnswer,
  type QuizResult,
} from "@/app/actions/learning";
import RichContent from "@/components/content/RichContent";
import { useLanguage } from "@/hooks/useLanguage";

type QuizQuestion = {
  id: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  prompt: string;
  options?: string[];
};

const OPTION_ANSWER_PREFIX = "option-index:";

export default function LessonQuiz({
  lessonId,
  questions,
  savedScore,
}: {
  lessonId: string;
  questions: QuizQuestion[];
  savedScore: number | null;
}) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(savedScore);
  const [results, setResults] = useState<QuizResult[] | null>(null);
  const [resultsLanguage, setResultsLanguage] = useState(language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!questions.length) return null;
  const currentQuestion = questions[currentIndex];
  const currentResult =
    resultsLanguage === language
      ? results?.find((item) => item.questionId === currentQuestion.id)
      : undefined;

  function retry() {
    setAnswers({});
    setScore(null);
    setResults(null);
    setError("");
    setCurrentIndex(0);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const submitted: QuizAnswer[] = questions.map((question) => ({
      questionId: question.id,
      answer:
        question.type === "short_answer"
          ? answers[question.id] ?? ""
          : question.type === "true_false"
            ? ["True", "False"][Number(answers[question.id]?.slice(OPTION_ANSWER_PREFIX.length))] ?? ""
            : question.options?.[Number(answers[question.id]?.slice(OPTION_ANSWER_PREFIX.length))] ?? "",
    }));

    startTransition(async () => {
      const result = await submitLessonQuiz(lessonId, submitted);
      if ("error" in result) {
        setError(result.error ?? t("appShell.lessonContent.quizError"));
        return;
      }
      setScore(result.score);
      setResults(result.results);
      setResultsLanguage(language);
      router.refresh();
    });
  }

  return (
    <section
      aria-labelledby="lesson-quiz-title"
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7D288F] dark:text-purple-300">
        {t("appShell.lessonContent.quizEyebrow")}
      </p>
      <h2 id="lesson-quiz-title" className="mt-2 text-xl font-extrabold text-[var(--fg)]">
        {t("appShell.lessonContent.quizTitle")}
      </h2>

      <form onSubmit={submit} className="mt-6 space-y-7">
        <p className="text-sm font-semibold text-[var(--fg-muted)]" aria-live="polite">
          {t("appShell.lessonContent.questionProgress")
            .replace("{current}", String(currentIndex + 1))
            .replace("{total}", String(questions.length))}
        </p>
        <fieldset key={currentQuestion.id} className="space-y-3">
          <legend className="font-semibold leading-6 text-[var(--fg)]">
            <RichContent content={currentQuestion.prompt} className="inline [&_p]:my-0 [&_p]:inline" />
          </legend>
          {currentQuestion.type === "short_answer" ? (
            <input
              type="text"
              value={answers[currentQuestion.id] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({ ...current, [currentQuestion.id]: event.target.value }))
              }
              disabled={pending || results !== null}
              aria-label={`Answer: ${currentQuestion.prompt}`}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
            />
          ) : (
            <div className="space-y-2">
              {(currentQuestion.type === "true_false" ? ["True", "False"] : currentQuestion.options ?? []).map((option, optionIndex) => (
                <label
                  key={`${currentQuestion.id}-${optionIndex}`}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border)] p-3 text-sm text-[var(--fg)] transition-colors has-[:checked]:border-[#7D288F] has-[:checked]:bg-[var(--brand-soft)]"
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={optionIndex}
                    checked={answers[currentQuestion.id] === `${OPTION_ANSWER_PREFIX}${optionIndex}`}
                    onChange={() =>
                      setAnswers((current) => ({
                        ...current,
                        [currentQuestion.id]: `${OPTION_ANSWER_PREFIX}${optionIndex}`,
                      }))
                    }
                    disabled={pending || results !== null}
                    className="mt-0.5 accent-[#7D288F]"
                  />
                  <span>
                    {currentQuestion.type === "true_false"
                      ? t(option === "True"
                          ? "appShell.lessonContent.trueValue"
                          : "appShell.lessonContent.falseValue")
                      : option}
                  </span>
                </label>
              ))}
            </div>
          )}
          {currentResult && (
            <div
              role="status"
              className={`rounded-lg p-3 text-sm ${
                currentResult.correct
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300"
              }`}
            >
              <p className="font-bold">
                {currentResult.correct
                  ? t("appShell.lessonContent.correct")
                  : `${t("appShell.lessonContent.incorrect")} ${currentResult.correctAnswer}`}
              </p>
              <RichContent content={currentResult.explanation} className="mt-1 [&_p]:my-1 [&_p]:text-sm" />
            </div>
          )}
        </fieldset>

        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-5">
          <div className="flex flex-1 flex-wrap gap-2">
            {currentIndex > 0 && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setCurrentIndex((index) => index - 1)}
                className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] disabled:opacity-60"
              >
                {t("appShell.lessonContent.previousQuestion")}
              </button>
            )}
            {currentIndex < questions.length - 1 && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setCurrentIndex((index) => index + 1)}
                className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] disabled:opacity-60"
              >
                {t("appShell.lessonContent.nextQuestion")}
              </button>
            )}
          </div>
          {results ? (
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-[#7D288F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#681f78]"
            >
              {t("appShell.lessonContent.retryQuiz")}
            </button>
          ) : currentIndex === questions.length - 1 ? (
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[#7D288F] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#681f78] disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? t("appShell.lessonContent.checking") : t("appShell.lessonContent.checkAnswer")}
            </button>
          ) : null}
          {score !== null && (
            <p role="status" className="text-sm font-bold text-[var(--fg)]">
              {t("appShell.lessonContent.score")}: {score}%
            </p>
          )}
        </div>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </section>
  );
}
