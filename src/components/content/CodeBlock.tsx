"use client";

import { useState, type ReactNode } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  http: "HTTP",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  markdown: "Markdown",
  md: "Markdown",
  python: "Python",
  py: "Python",
  sql: "SQL",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
};

const TOKEN_PATTERN =
  /(<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[\w:-]+|\/?>|\b(?:const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw|true|false|null|undefined|public|private|static|def|print|select|from|where|insert|into|values|update|delete|create|table|async|await)\b|@[a-z-]+|#[\da-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw)?\b|[A-Za-z_][\w-]*(?=\s*:)|\b[A-Za-z_]\w*(?=\())/gi;

function textColor(token: string, language: string) {
  if (/^(<!--|\/\*|\/\/)/.test(token)) return "text-white/40";
  if (/^["'`]/.test(token)) return "text-emerald-300";
  if (/^<\/?[\w:-]+|^\/?>$/.test(token)) return "text-purple-300";
  if (/^#[\da-f]{3,8}$/i.test(token) || /^@|^\d/.test(token)) return "text-amber-200";
  if (token.startsWith("#")) return language === "css" ? "text-amber-200" : "text-white/40";
  if (/^(const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw|true|false|null|undefined|public|private|static|def|print|select|where|insert|into|values|update|delete|create|table)$/i.test(token)) {
    return "text-purple-300";
  }
  if (language === "css" && /^[A-Za-z_][\w-]*$/.test(token)) return "text-sky-200";
  if (/^[A-Za-z_]\w*$/.test(token)) return "text-sky-200";
  return "";
}

function highlightLine(line: string, language: string): ReactNode[] {
  return line.split(TOKEN_PATTERN).map((token, index) => {
    if (!token) return null;
    const color = textColor(token, language);
    return color ? <span key={`${index}-${token}`} className={color}>{token}</span> : token;
  });
}

export default function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers = true,
}: {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const normalizedLanguage = language.toLowerCase();
  const lines = code.replace(/\n$/, "").split("\n");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
    window.setTimeout(() => {
      setCopied(false);
      setCopyError(false);
    }, 1800);
  }

  return (
    <figure className="my-5 min-w-0 overflow-hidden rounded-xl border border-[#342b3d] bg-[#17131c] text-white shadow-sm">
      <figcaption className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 bg-[#1d1823] px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-purple-200">
            {LANGUAGE_LABELS[normalizedLanguage] ?? language}
          </span>
          {filename && <span className="truncate text-xs text-white/65">{filename}</span>}
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300"
        >
          {copied ? t("content.codeCopied") : copyError ? t("content.copyFailed") : t("content.copyCode")}
        </button>
      </figcaption>
      <pre dir="ltr" className="max-w-full overflow-x-auto p-3 text-[12px] leading-6 sm:p-4 sm:text-[13px]" tabIndex={0}>
        <code dir="ltr" className={`language-${normalizedLanguage}`}>
          {lines.map((line, index) => (
            <span key={`${index}-${line}`} className={showLineNumbers ? "grid grid-cols-[2.25rem_minmax(0,1fr)]" : "block"}>
              {showLineNumbers && (
                <span aria-hidden="true" className="select-none pe-3 text-end text-white/30">
                  {index + 1}
                </span>
              )}
              <span className="whitespace-pre">{highlightLine(line, normalizedLanguage)}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
