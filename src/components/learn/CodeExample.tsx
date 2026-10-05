"use client";

import { useId, useState } from "react";
import CodeBlock from "@/components/content/CodeBlock";
import { useLanguage } from "@/hooks/useLanguage";

export type CodeExampleData = {
  title: string;
  language: "html" | "css" | "javascript";
  code: string;
  preview?: boolean;
};

export default function CodeExample({ example }: { example: CodeExampleData }) {
  const { t } = useLanguage();
  const [editable, setEditable] = useState(false);
  const [editedCode, setEditedCode] = useState(example.code);
  const editorId = useId();

  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <h4 className="text-sm font-semibold text-[var(--fg)]">{example.title}</h4>
        {example.preview && (
          <button
            type="button"
            onClick={() => setEditable((value) => !value)}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
          >
            {editable ? t("content.hideEditor") : t("content.tryIt")}
          </button>
        )}
      </div>
      {editable ? (
        <div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">
          <label className="sr-only" htmlFor={editorId}>
            {t("content.editExample")}
          </label>
          <textarea
            id={editorId}
            value={editedCode}
            onChange={(event) => setEditedCode(event.target.value)}
            spellCheck={false}
            className="min-h-48 resize-y bg-[#17131c] p-4 font-mono text-xs leading-6 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple-300"
          />
          <div className="bg-white p-4 text-black">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">{t("content.livePreview")}</p>
            <iframe
              title={`${example.title} preview`}
              sandbox={example.language === "javascript" ? "allow-scripts" : ""}
              srcDoc={createPreviewDocument(editedCode, example.language)}
              className="min-h-32 w-full border-0"
            />
          </div>
        </div>
      ) : (
        <CodeBlock code={example.code} language={example.language} filename={example.title} />
      )}
    </section>
  );
}

function createPreviewDocument(code: string, language: CodeExampleData["language"]) {
  if (language === "html") return code;
  if (language === "css") {
    return `<!doctype html><html><head><style>${code}</style></head><body><main><h1>Live preview</h1><p>Edit the CSS to see your styles here.</p><button type="button">Example button</button></main></body></html>`;
  }
  return `<!doctype html><html><body><main><h1 id="preview-heading">Live preview</h1><p id="preview-message">Edit the JavaScript to change this page.</p></main><script>try { ${code}\n } catch (error) { document.body.textContent = String(error); }</script></body></html>`;
}
