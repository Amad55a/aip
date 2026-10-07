"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useAIDailyUsage } from "@/hooks/useAIDailyUsage";
import RichContent from "@/components/content/RichContent";

type MentorContext = {
  user_id: string;
  learning_path_id: string;
  learning_path: string;
  course_id: string;
  course: string;
  module_id: string;
  module: string;
  lesson_id: string;
  lesson: string;
  lesson_level: string;
};

type Message = {
  role: "user" | "model";
  content: string;
};

function validContext(value: unknown): value is MentorContext {
  if (typeof value !== "object" || value === null) return false;
  const context = value as Record<string, unknown>;
  return [
    "user_id",
    "learning_path_id",
    "learning_path",
    "course_id",
    "course",
    "module_id",
    "module",
    "lesson_id",
    "lesson",
    "lesson_level",
  ].every((key) => typeof context[key] === "string" && context[key].length > 0);
}

type CodeQuestionContext = {
  lessonTitle?: string;
  explanation?: string;
  code?: string;
  language?: string;
  output?: string;
  preview?: string;
  mode?: "javascript" | "html-css";
};

export default function AIMentorChat({
  initialContext,
  onClose,
  codeContext,
}: {
  initialContext?: Omit<MentorContext, "user_id">;
  onClose?: () => void;
  codeContext?: CodeQuestionContext;
}) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const {
    usage,
    loading: usageLoading,
    unavailable: usageUnavailable,
    signInRequired,
    updateFromResponse,
  } = useAIDailyUsage();
  const [context, setContext] = useState<MentorContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const promptHint = codeContext
    ? `Current lesson: ${codeContext.lessonTitle ?? context?.lesson ?? "this lesson"}.\nExplanation: ${codeContext.explanation ?? ""}\nProgramming language: ${codeContext.language ?? "unknown"}\nCode:\n${codeContext.code ?? ""}\nOutput/preview:\n${codeContext.output ?? codeContext.preview ?? ""}`
    : "";

  useEffect(() => {
    if (initialContext) {
      if (user) setContext({ ...initialContext, user_id: user.id });
      return;
    }

    try {
      const stored = window.sessionStorage.getItem("ai-mentor-context");
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!validContext(parsed)) {
        setError(t("appShell.lessonAI.invalidContext"));
        return;
      }
      if (parsed.user_id !== user?.id) {
        setError(t("appShell.lessonAI.accountMismatch"));
        return;
      }
      setContext(parsed);
    } catch {
      setError(t("appShell.lessonAI.contextReadError"));
    }
  }, [initialContext, user, t]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || pending || !context || usageLoading || usageUnavailable || usage?.remaining === 0) return;

    const enrichedQuestion = promptHint
      ? `${question}\n\nContext for this code example:\n${promptHint}`
      : question;

    const outgoing = [...messages, { role: "user" as const, content: enrichedQuestion }].slice(-12);
    while (outgoing[0]?.role !== "user") outgoing.shift();
    setMessages(outgoing);
    setInput("");
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/ai-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, messages: outgoing, language }),
      });
      const result: unknown = await response.json();
      updateFromResponse(result);
      if (!response.ok || typeof result !== "object" || result === null) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : t("appShell.lessonAI.answerError");
        setError(message);
        return;
      }
      if (!("answer" in result) || typeof result.answer !== "string") {
        setError(t("appShell.lessonAI.unreadableAnswer"));
        return;
      }
      const answer = result.answer;
      setMessages((current) => [...current, { role: "model", content: answer }]);
    } catch {
      setError(t("appShell.lessonAI.connectionError"));
    } finally {
      setPending(false);
    }
  }

  if (!context) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--fg-muted)]">
          {error || t("appShell.lessonAI.contextRequired")}
        </p>
        <Link
          href="/learn"
          className="mt-4 inline-flex rounded-lg bg-[#7D288F] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#681f78]"
        >
          {t("appShell.lessonAI.findLesson")}
        </Link>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-subtle)] p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7D288F] dark:text-purple-300">
          {t("appShell.lessonAI.contextLabel")}
        </p>
        <h2 className="mt-2 text-lg font-bold text-[var(--fg)]">{context.lesson}</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {context.learning_path} · {context.course} · {context.module} · {context.lesson_level}
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 rounded-lg px-2 py-1 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
          >
            {t("appShell.lessonAI.close")}
          </button>
        )}
      </header>

      <div aria-live="polite" className="max-h-[55vh] min-h-56 space-y-4 overflow-y-auto p-5 sm:p-6">
        {messages.length === 0 && (
          <p className="text-sm leading-6 text-[var(--fg-muted)]">
            {t("appShell.lessonAI.emptyState")}
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`max-w-[95%] rounded-xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ms-auto bg-[#7D288F] text-white"
                : "bg-[var(--bg-subtle)] text-[var(--fg)]"
            }`}
          >
            {message.role === "model" ? (
              <RichContent content={message.content} className="[&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0" />
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
        ))}
        {pending && <p className="text-sm text-[var(--fg-muted)]">{t("appShell.lessonAI.thinking")}</p>}
      </div>

      <form onSubmit={sendMessage} className="border-t border-[var(--border)] p-4 sm:p-5">
        <label htmlFor="mentor-message" className="sr-only">{t("appShell.lessonAI.inputLabel")}</label>
        {usage && (
          <p className="mb-3 text-xs font-semibold text-[var(--fg-muted)]" role="status">
            {usage.remaining > 0
              ? t("appShell.aiUsage.remaining").replace("{count}", String(usage.remaining))
              : t("appShell.aiUsage.limitReached").replace("{limit}", String(usage.limit))}
          </p>
        )}
        {(usageUnavailable || signInRequired) && (
          <p role="alert" className="mb-3 text-sm text-red-600 dark:text-red-400">
            {t(signInRequired ? "appShell.aiUsage.signInRequired" : "appShell.aiUsage.loadingError")}
          </p>
        )}
        <div className="flex items-end gap-3">
          <textarea
            id="mentor-message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={4000}
            rows={2}
            disabled={pending || usageLoading || usageUnavailable || signInRequired || usage?.remaining === 0}
            placeholder={`${t("appShell.lessonAI.askAbout")} ${context.lesson}…`}
            className="min-h-12 flex-1 resize-y rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
          />
          <button
            type="submit"
            disabled={pending || usageLoading || usageUnavailable || signInRequired || usage?.remaining === 0 || !input.trim()}
            className="rounded-lg bg-[#7D288F] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#681f78] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("appShell.lessonAI.send")}
          </button>
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </section>
  );
}
