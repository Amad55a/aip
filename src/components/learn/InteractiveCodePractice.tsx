"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

type PracticeMode = "javascript" | "html-css";

const JS_TIMEOUT_MS = 3000;

function buildJavaScriptSandboxDocument(source: string, runId: string) {
  const safeSource = source.replace(/<\/script>/gi, "<\\/script>");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root {
          color-scheme: dark;
        }
        body {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
          background: #120d17;
          color: #f4f1f8;
          padding: 1rem;
          font-size: 13px;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <script>
        const runId = ${JSON.stringify(runId)};
        const send = (kind, text) => {
          parent.postMessage({ type: "techpath:code-practice", runId, kind, text }, "*");
        };
        const safeStringify = (value) => {
          if (typeof value === "string") return value;
          if (typeof value === "undefined") return "undefined";
          if (typeof value === "function") return "[Function]";
          if (typeof value === "symbol") return value.toString();
          if (typeof value === "number" || typeof value === "boolean" || value === null) {
            return String(value);
          }
          try {
            return JSON.stringify(value, null, 2);
          } catch {
            return String(value);
          }
        };
        const originalConsole = {
          log: console.log.bind(console),
          info: console.info.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console),
        };
        ["log", "info", "warn", "error"].forEach((method) => {
          console[method] = (...args) => {
            const message = args.map((value) => safeStringify(value)).join(" ");
            send(method, message);
            originalConsole[method](...args);
          };
        });
        try {
          ${safeSource}
          send("status", "ready");
        } catch (error) {
          const message = error && error.stack ? String(error.stack) : String(error);
          send("error", message);
          send("status", "ready");
        }
      <\/script>
    </body>
  </html>`;
}

function buildHtmlCssSandboxDocument(html: string, css: string) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        html, body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #ffffff;
          color: #1b1b1b;
        }
        body {
          padding: 1rem;
        }
        ${css}
      </style>
    </head>
    <body>
      ${html}
    </body>
  </html>`;
}

function CodeEditorPanel({
  value,
  onChange,
  language,
  minHeight = "220px",
}: {
  value: string;
  onChange: (value: string) => void;
  language: "javascript" | "html" | "css";
  minHeight?: string;
}) {
  const lineCount = Math.max(value.split("\n").length, 1);

  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]">
      <div className="select-none border-r border-[var(--border)] bg-[var(--surface)] px-2 py-4 text-right text-[11px] leading-6 text-[var(--fg-muted)] font-mono">
        {Array.from({ length: lineCount }, (_, index) => (
          <div key={`line-${index + 1}`}>{index + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          event.preventDefault();
          const target = event.currentTarget;
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
          onChange(nextValue);
          requestAnimationFrame(() => {
            target.selectionStart = start + 2;
            target.selectionEnd = start + 2;
          });
        }}
        className="min-h-[220px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-6 text-[var(--fg)] outline-none"
        style={{ minHeight }}
        aria-label={`${language} editor`}
      />
    </div>
  );
}

export default function InteractiveCodePractice({
  title,
  mode,
  initialCode,
  initialHtml,
  initialCss,
}: {
  title?: string;
  mode: PracticeMode;
  initialCode?: string;
  initialHtml?: string;
  initialCss?: string;
}) {
  const { t } = useLanguage();
  const [jsValue, setJsValue] = useState(
    initialCode ?? `const name = "Ali";\nconsole.log(name);` 
  );
  const [htmlValue, setHtmlValue] = useState(initialHtml ?? "<h1>Hello</h1>\n<p>Welcome!</p>");
  const [cssValue, setCssValue] = useState(initialCss ?? "h1 {\n  color: purple;\n}\n\np {\n  color: #333;\n}");
  const [jsOutput, setJsOutput] = useState<string[]>([]);
  const [runId, setRunId] = useState("ready");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "ready" | "timeout">("idle");
  const [previewDoc, setPreviewDoc] = useState(() => buildHtmlCssSandboxDocument(htmlValue, cssValue));
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "techpath:code-practice") {
        return;
      }
      if (event.data.runId !== runId) {
        return;
      }
      if (event.data.kind === "status" && event.data.text === "ready") {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsRunning(false);
        setStatus("ready");
        return;
      }
      if (event.data.kind === "error") {
        setJsOutput((previous) => [...previous, String(event.data.text)]);
        return;
      }
      if (typeof event.data.text === "string") {
        setJsOutput((previous) => [...previous, event.data.text]);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [runId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // no-op; clipboard is optional on unsupported browsers
    }
  };

  const handleResetJs = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const resetCode = initialCode ?? `const name = "Ali";\nconsole.log(name);`;
    setJsValue(resetCode);
    setJsOutput([]);
    setStatus("idle");
    setIsRunning(false);
    setRunId(`reset-${Date.now()}`);
  };

  const handleRunJs = () => {
    if (isRunning) {
      return;
    }

    const currentRunId = `js-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setRunId(currentRunId);
    setJsOutput([]);
    setIsRunning(true);
    setStatus("idle");

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsRunning(false);
      setStatus("timeout");
      setJsOutput([t("content.timedOut")]);
      setRunId(`timeout-${Date.now()}`);
    }, JS_TIMEOUT_MS);
  };

  const handleResetHtmlCss = () => {
    setHtmlValue(initialHtml ?? "<h1>Hello</h1>\n<p>Welcome!</p>");
    setCssValue(initialCss ?? "h1 {\n  color: purple;\n}\n\np {\n  color: #333;\n}");
    setPreviewDoc(buildHtmlCssSandboxDocument(initialHtml ?? "<h1>Hello</h1>\n<p>Welcome!</p>", initialCss ?? "h1 {\n  color: purple;\n}\n\np {\n  color: #333;\n}"));
  };

  const handleRunHtmlCss = () => {
    setPreviewDoc(buildHtmlCssSandboxDocument(htmlValue, cssValue));
  };

  if (mode === "javascript") {
    return (
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
              {title ?? t("content.interactivePractice")}
            </p>
            <h3 className="mt-1 text-base font-bold text-[var(--fg)]">{t("content.javascript")}</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleCopy(jsValue)}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
            >
              {t("content.copyCode")}
            </button>
            <button
              type="button"
              onClick={handleResetJs}
              className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
            >
              {t("content.reset")}
            </button>
            <button
              type="button"
              onClick={handleRunJs}
              disabled={isRunning}
              className="rounded-md bg-[#7D288F] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#68217b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRunning ? t("content.running") : t("content.runCode")}
            </button>
          </div>
        </div>

        <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-[var(--bg)]">
            <label className="block border-b border-[var(--border)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
              JavaScript
            </label>
            <CodeEditorPanel
              value={jsValue}
              onChange={setJsValue}
              language="javascript"
              minHeight="220px"
            />
          </div>

          <div className="bg-[var(--bg)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
                {t("content.console")}
              </span>
              {status === "timeout" ? <span className="text-xs text-red-500">{t("content.timedOut")}</span> : null}
            </div>
            <div className="min-h-[220px] bg-[#120d17] p-4 font-mono text-sm leading-6 text-[#f4f1f8]">
              {jsOutput.length ? (
                <pre className="whitespace-pre-wrap break-words">{jsOutput.join("\n")}</pre>
              ) : (
                <p className="text-[#d9d1e3]">{isRunning ? t("content.running") : t("content.output")}</p>
              )}
            </div>
          </div>
        </div>

        <iframe
          key={runId}
          title="JavaScript sandbox"
          sandbox="allow-scripts"
          srcDoc={buildJavaScriptSandboxDocument(jsValue, runId)}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
            {title ?? t("content.interactivePractice")}
          </p>
          <h3 className="mt-1 text-base font-bold text-[var(--fg)]">{t("content.preview")}</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetHtmlCss}
            className="rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
          >
            {t("content.reset")}
          </button>
          <button
            type="button"
            onClick={handleRunHtmlCss}
            className="rounded-md bg-[#7D288F] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#68217b]"
          >
            {t("content.runPreview")}
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">
        <div className="space-y-px bg-[var(--border)]">
          <div className="bg-[var(--bg)]">
            <label className="block border-b border-[var(--border)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
              {t("content.html")}
            </label>
            <CodeEditorPanel
              value={htmlValue}
              onChange={setHtmlValue}
              language="html"
              minHeight="220px"
            />
          </div>
          <div className="bg-[var(--bg)]">
            <label className="block border-b border-[var(--border)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
              {t("content.css")}
            </label>
            <CodeEditorPanel
              value={cssValue}
              onChange={setCssValue}
              language="css"
              minHeight="220px"
            />
          </div>
        </div>

        <div className="bg-[var(--bg)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
              {t("content.preview")}
            </span>
          </div>
          <iframe
            title="HTML/CSS preview"
            sandbox="allow-scripts"
            srcDoc={previewDoc}
            className="h-[460px] w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
