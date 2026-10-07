"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
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
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; font-src data: https:" />
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

function highlightedCode(code: string, language: "javascript" | "html" | "css"): ReactNode[] {
  const pattern = language === "html"
    ? /(<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>)/g
    : language === "css"
      ? /(\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[\da-fA-F]{3,8}\b|\b[\w-]+(?=\s*:)|[{}:;])/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|true|false|null|undefined|new|class|for|while)\b|\b\d+(?:\.\d+)?\b)/g;
  const tokens = code.split(pattern);

  return tokens.map((token, index) => {
    if (!token) return null;
    let colorClass: string | null = null;
    if (language === "html" && (/^<!--/.test(token) || /^</.test(token))) {
      colorClass = /^<!--/.test(token) ? "text-emerald-600 dark:text-emerald-300" : "text-[#a626a4] dark:text-[#e7a5e4]";
    } else if (language === "css") {
      if (/^\/\*/.test(token)) colorClass = "text-emerald-600 dark:text-emerald-300";
      else if (/^["']/.test(token) || /^#/.test(token)) colorClass = "text-amber-700 dark:text-amber-300";
      else if (/^[{}:;]$/.test(token)) colorClass = "text-[var(--fg-muted)]";
      else if (/^[\w-]+$/.test(token)) colorClass = "text-sky-700 dark:text-sky-300";
    } else {
      if (/^(?:\/\/|\/\*)/.test(token)) colorClass = "text-emerald-600 dark:text-emerald-300";
      else if (/^["'`]/.test(token)) colorClass = "text-amber-700 dark:text-amber-300";
      else if (/^(?:const|let|var|function|return|if|else|true|false|null|undefined|new|class|for|while)$/.test(token)) colorClass = "text-[#a626a4] dark:text-[#e7a5e4]";
      else if (/^\d/.test(token)) colorClass = "text-sky-700 dark:text-sky-300";
    }

    return colorClass
      ? <span key={index} className={colorClass}>{token}</span>
      : <span key={index}>{token}</span>;
  });
}

function CodeEditorPanel({
  value,
  onChange,
  language,
  minHeight = "120px",
}: {
  value: string;
  onChange: (value: string) => void;
  language: "javascript" | "html" | "css";
  minHeight?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightedRef = useRef<HTMLPreElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const lineCount = Math.max(value.split("\n").length, 1);

  return (
    <div className="grid grid-cols-[36px_minmax(0,1fr)] overflow-hidden border-y border-[var(--border)] bg-[var(--bg)]">
      <div ref={lineNumbersRef} className="select-none overflow-hidden border-r border-[var(--border)] bg-[var(--surface)] px-2 py-3 text-right font-mono text-[11px] leading-6 text-[var(--fg-muted)]">
        {Array.from({ length: lineCount }, (_, index) => (
          <div key={`line-${index + 1}`}>{index + 1}</div>
        ))}
      </div>
      <div className="relative min-w-0">
        <pre
          ref={highlightedRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre p-3 font-mono text-sm leading-6 text-[var(--fg)]"
        >{highlightedCode(value, language)}{"\n"}</pre>
        <textarea
          ref={textareaRef}
          value={value}
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
          onScroll={(event) => {
            if (lineNumbersRef.current) {
              lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
            }
            if (highlightedRef.current) {
              highlightedRef.current.scrollTop = event.currentTarget.scrollTop;
              highlightedRef.current.scrollLeft = event.currentTarget.scrollLeft;
            }
          }}
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
          className="relative min-h-[104px] w-full resize-y overflow-auto whitespace-pre border-0 bg-transparent p-3 font-mono text-sm leading-6 text-transparent caret-[var(--fg)] outline-none selection:bg-[#7D288F]/25"
          style={{ minHeight }}
          aria-label={`${language} editor`}
        />
      </div>
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
  const [previewDoc, setPreviewDoc] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const sandboxRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "techpath:code-practice") {
        return;
      }
      if (event.source !== sandboxRef.current?.contentWindow) {
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
        setJsOutput((previous) => [...previous.slice(-99), String(event.data.text)]);
        return;
      }
      if (typeof event.data.text === "string") {
        setJsOutput((previous) => [...previous.slice(-99), event.data.text]);
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
    setPreviewDoc("");
  };

  const handleRunHtmlCss = () => {
    setPreviewDoc(buildHtmlCssSandboxDocument(htmlValue, cssValue));
  };

  if (mode === "javascript") {
    return (
      <div className="w-full max-w-3xl">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[var(--fg-muted)]">{title ?? t("content.javascript")}</span>
          <span className="text-[11px] text-[var(--fg-muted)]">{t("content.javascript")}</span>
        </div>
        <CodeEditorPanel value={jsValue} onChange={setJsValue} language="javascript" />
        <div className="flex items-center gap-2 border-b border-[var(--border)] py-2">
          <button
            type="button"
            onClick={handleRunJs}
            disabled={isRunning}
            className="rounded-md bg-[#7D288F] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#68217b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRunning ? t("content.running") : t("content.runCode")}
          </button>
          <button
            type="button"
            onClick={handleResetJs}
            className="rounded-md px-2.5 py-1.5 text-xs text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
          >
            {t("content.reset")}
          </button>
          <button
            type="button"
            onClick={() => handleCopy(jsValue)}
            className="ms-auto rounded-md px-2.5 py-1.5 text-xs text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
          >
            {t("content.copyCode")}
          </button>
        </div>
        <div className="mt-2 min-h-16 border-s-2 border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--fg-muted)]">{t("content.console")}</p>
          {jsOutput.length ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-[var(--fg)]">{jsOutput.join("\n")}</pre>
          ) : (
            <p className="text-sm text-[var(--fg-muted)]">{isRunning ? t("content.running") : "Run the code to see the result here."}</p>
          )}
          {status === "timeout" ? <p role="alert" className="mt-1 text-xs text-red-500">{t("content.timedOut")}</p> : null}
        </div>
        <iframe
          ref={sandboxRef}
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
    <div className="w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--fg-muted)]">{title ?? t("content.interactivePractice")}</span>
        <span className="text-[11px] text-[var(--fg-muted)]">HTML + CSS</span>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-[var(--fg-muted)]">{t("content.html")}</label>
          <CodeEditorPanel value={htmlValue} onChange={setHtmlValue} language="html" />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-[var(--fg-muted)]">{t("content.css")}</label>
          <CodeEditorPanel value={cssValue} onChange={setCssValue} language="css" />
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-[var(--border)] py-2">
        <button
          type="button"
          onClick={handleRunHtmlCss}
          className="rounded-md bg-[#7D288F] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#68217b]"
        >
          {t("content.runPreview")}
        </button>
        <button
          type="button"
          onClick={handleResetHtmlCss}
          className="rounded-md px-2.5 py-1.5 text-xs text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
        >
          {t("content.reset")}
        </button>
      </div>
      <div className="mt-2 overflow-hidden border-s-2 border-[var(--border)] bg-[var(--bg-subtle)]">
        <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--fg-muted)]">{t("content.preview")}</p>
        {previewDoc ? (
          <iframe
            title="HTML/CSS preview"
            sandbox=""
            srcDoc={previewDoc}
            className="h-48 w-full border-0 bg-white"
          />
        ) : (
          <p className="px-3 py-4 text-sm text-[var(--fg-muted)]">Run the code to see the page here.</p>
        )}
      </div>
    </div>
  );
}
