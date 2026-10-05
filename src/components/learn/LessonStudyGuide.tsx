"use client";

import CodeBlock from "@/components/content/CodeBlock";
import RichContent from "@/components/content/RichContent";
import { useLanguage } from "@/hooks/useLanguage";
import { explainCodeExample } from "@/lib/learning/code-explanations";
import type { LessonStudyMaterial } from "@/lib/learning/lesson-content";
import type { Lesson } from "@/lib/supabase/database.types";
import type { ReactNode } from "react";

export default function LessonStudyGuide({
  material,
  publishedNote,
  examples,
  codeExamples,
  notes,
  commonMistakes,
  practice,
}: {
  material: LessonStudyMaterial;
  publishedNote: string;
  examples: Lesson["examples"];
  codeExamples: Lesson["code_examples"];
  notes: Lesson["notes"];
  commonMistakes: Lesson["common_mistakes"];
  practice: Lesson["practice"];
}) {
  const { t } = useLanguage();
  const displayedCodeExamples = [
    material.codeExample,
    ...codeExamples.filter((example) => example.code !== material.codeExample.code),
  ];
  const items = [
    { title: t("appShell.lessonContent.uses"), values: material.useCases },
    { title: t("appShell.lessonContent.mistakes"), values: [...material.mistakes, ...commonMistakes] },
    { title: t("appShell.lessonContent.tips"), values: [...material.tips, ...notes] },
    { title: t("appShell.lessonContent.practice"), values: [...material.practice, ...practice] },
  ];

  return (
    <article className="space-y-9 py-8">
      {publishedNote.trim() && (
        <LessonSection title={t("appShell.lessonContent.publishedNote")}>
          <RichContent content={publishedNote} />
        </LessonSection>
      )}

      <LessonSection title={t("appShell.lessonContent.concept")}>
        <RichContent content={material.explanation} />
      </LessonSection>

      <LessonSection title={t("appShell.lessonContent.example")}>
        <RichContent content={material.example} />
        {examples.map((example, index) => (
          <div key={`${example.title}-${index}`} className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
            <RichContent content={`### ${example.title}\n\n${example.body}`} />
          </div>
        ))}
      </LessonSection>

      <LessonSection title={t("appShell.lessonContent.codeExample")}>
        {displayedCodeExamples.map((example, index) => (
          <div key={`${example.title}-${index}`}>
            <CodeBlock code={example.code} language={example.language} filename={example.title} />
            <h3 className="mb-2 mt-5 text-base font-bold text-[var(--fg)]">
              {t("appShell.lessonContent.codeExplanation")}
            </h3>
            <RichContent
              content={
                "explanation" in example && typeof example.explanation === "string"
                  ? example.explanation
                  : explainCodeExample(example.title, example.language, example.code)
              }
            />
          </div>
        ))}
      </LessonSection>

      {items.map(({ title, values }, sectionIndex) => (
        <LessonSection key={title} title={title}>
          {sectionIndex === 3 ? (
            <ol className="space-y-3">
              {values.map((value, index) => (
                <li
                  key={`${index}-${value}`}
                  className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--fg)]"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-bold text-[#7D288F] dark:text-purple-300">
                    {index + 1}
                  </span>
                  <RichContent content={value} className="min-w-0 flex-1" />
                </li>
              ))}
            </ol>
          ) : (
            <ul className="space-y-2.5">
              {values.map((value, index) => (
                <li key={`${index}-${value}`} className="flex gap-3 text-sm leading-6 text-[var(--fg)]">
                  <span aria-hidden="true" className="mt-0.5 font-bold text-[#7D288F] dark:text-purple-300">
                    {sectionIndex === 1 ? "!" : "•"}
                  </span>
                  <RichContent content={value} className="min-w-0 flex-1" />
                </li>
              ))}
            </ul>
          )}
        </LessonSection>
      ))}
    </article>
  );
}

function LessonSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-label={title}>
      <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[var(--fg)]">{title}</h2>
      {children}
    </section>
  );
}
