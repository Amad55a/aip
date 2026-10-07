"use client";

import { Children, cloneElement, isValidElement, useMemo, type ReactNode } from "react";
import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/content/CodeBlock";
import { useLanguage } from "@/hooks/useLanguage";

function getText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(getText).join("");
  if (isValidElement<{ children?: ReactNode }>(value)) return getText(value.props.children);
  return "";
}

function stripCalloutMarker(node: ReactNode, marker: RegExp): ReactNode {
  if (typeof node === "string") return node.replace(marker, "");
  if (Array.isArray(node)) {
    let removed = false;
    return node.map((child) => {
      if (removed) return child;
      const text = getText(child);
      marker.lastIndex = 0;
      if (!marker.test(text)) return child;
      removed = true;
      marker.lastIndex = 0;
      if (typeof child === "string") return child.replace(marker, "");
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return cloneElement(child, {
          children: stripCalloutMarker(child.props.children, marker),
        });
      }
      return child;
    });
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(node, { children: stripCalloutMarker(node.props.children, marker) });
  }
  return node;
}

function getLanguage(className?: string) {
  return className?.match(/language-([\w+-]+)/)?.[1] ?? "text";
}

function getCodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getCodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return getCodeText(node.props.children);
  return "";
}

function removeMarkdownBold(content: string) {
  return content
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part
            .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "$1")
            .replace(/(?<![\w])__(?=\S)([\s\S]*?\S)__(?![\w])/g, "$1")
            .replace(/(?<!\*)\*\*(?!\*)|(?<![\w_])__(?![\w_])/g, "")
    )
    .join("");
}

function createComponents(t: (key: string) => string): Components {
return {
  h1: ({ children }) => <h2 className="mb-4 mt-8 text-2xl font-extrabold tracking-tight text-[var(--fg)]">{children}</h2>,
  h2: ({ children }) => <h2 className="mb-3 mt-8 text-xl font-extrabold tracking-tight text-[var(--fg)]">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-6 text-lg font-bold text-[var(--fg)]">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-5 text-base font-bold text-[var(--fg)]">{children}</h4>,
  p: ({ children }) => <p className="my-3 whitespace-pre-line text-sm leading-7 text-[var(--fg)] sm:text-base">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 ps-6 text-sm leading-7 text-[var(--fg)] sm:text-base">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 ps-6 text-sm leading-7 text-[var(--fg)] sm:text-base">{children}</ol>,
  li: ({ children }) => <li className="ps-1 marker:text-[#7D288F]">{children}</li>,
  strong: ({ children }) => <span className="font-normal text-[var(--fg)]">{children}</span>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined} className="font-medium text-[#7D288F] underline decoration-[#7D288F]/40 underline-offset-2 hover:decoration-[#7D288F] dark:text-purple-300">
      {children}
    </a>
  ),
  blockquote: ({ children }) => {
    const fullText = getText(children);
    const marker = /^\s*(?:\[!(INFO|TIP|WARNING|IMPORTANT)\]|(💡|⚠️|🧠)\s*(TIP|IMPORTANT|REMEMBER))\s*:?\s*/i;
    const match = fullText.match(marker);
    if (match) {
      const label = (match[1] ?? match[3] ?? "info").toLowerCase();
      const markerPattern = /^\s*(?:\[!(?:INFO|TIP|WARNING|IMPORTANT)\]|(?:💡|⚠️|🧠)\s*(?:TIP|IMPORTANT|REMEMBER))\s*:?\s*/i;
      const titleKey = label === "warning" ? "warning" : label === "important" || label === "remember" ? "important" : label === "tip" ? "tip" : "info";
      return (
        <aside className="my-5 rounded-xl border border-[#7D288F]/20 bg-[var(--brand-soft)] p-4 sm:p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#7D288F] dark:text-purple-300">
            {t(`content.callout.${titleKey}`)}
          </p>
          <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
            {stripCalloutMarker(children, markerPattern)}
          </div>
        </aside>
      );
    }
    return <blockquote className="my-5 border-s-4 border-[#7D288F] bg-[var(--bg-subtle)] py-1 ps-4 pe-3 text-[var(--fg-muted)] [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</blockquote>;
  },
  code: ({ className, children }) => (
    <code dir="ltr" className={className ?? "rounded bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[0.9em] text-[#7D288F] dark:text-purple-300"}>
      {children}
    </code>
  ),
  pre: ({ children }) => {
    const child = Children.toArray(children).find(isValidElement);
    const codeElement = child as React.ReactElement<{ className?: string; children?: ReactNode }> | undefined;
    const source = codeElement?.props.children ?? children;
    const code = getCodeText(source);
    return <CodeBlock code={code} language={getLanguage(codeElement?.props.className)} />;
  },
  table: ({ children }) => <div className="my-5 overflow-x-auto rounded-xl border border-[var(--border)]"><table className="w-full min-w-max border-collapse text-start text-sm">{children}</table></div>,
  thead: ({ children }) => <thead className="bg-[var(--bg-subtle)] text-[var(--fg)]">{children}</thead>,
  th: ({ children }) => <th className="border-b border-[var(--border)] px-4 py-3 text-start font-bold">{children}</th>,
  td: ({ children }) => <td className="border-b border-[var(--border)] px-4 py-3 text-[var(--fg-muted)]">{children}</td>,
  hr: () => <hr className="my-8 border-[var(--border)]" />,
  img: ({ src, alt }) => typeof src === "string" ? (
    <Image src={src} alt={alt ?? ""} width={1200} height={800} unoptimized className="my-5 h-auto max-h-[32rem] max-w-full rounded-xl border border-[var(--border)] object-contain" />
  ) : null,
};
}

export default function RichContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const { t } = useLanguage();
  const components = useMemo(() => createComponents(t), [t]);
  if (!content.trim()) return null;
  return (
    <div className={`min-w-0 break-words [&>p:first-child]:mt-0 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {removeMarkdownBold(content)}
      </ReactMarkdown>
    </div>
  );
}
