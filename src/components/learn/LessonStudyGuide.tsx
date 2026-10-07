"use client";

import CodeBlock from "@/components/content/CodeBlock";
import RichContent from "@/components/content/RichContent";
import { useLanguage } from "@/hooks/useLanguage";
import { explainCodeExample } from "@/lib/learning/code-explanations";
import type { LessonStudyMaterial } from "@/lib/learning/lesson-content";
import type { Lesson } from "@/lib/supabase/database.types";
import type { ReactNode } from "react";
import InteractiveCodePractice from "@/components/learn/InteractiveCodePractice";
import SomaliLessonAudio from "@/components/learn/SomaliLessonAudio";
import { AskAIMentorButton } from "@/components/learn/LessonActions";

export default function LessonStudyGuide({
  material,
  publishedNote,
  examples,
  codeExamples,
  notes,
  commonMistakes,
  practice,
  mentorContext,
}: {
  material: LessonStudyMaterial;
  publishedNote: string;
  examples: Lesson["examples"];
  codeExamples: Lesson["code_examples"];
  notes: Lesson["notes"];
  commonMistakes: Lesson["common_mistakes"];
  practice: Lesson["practice"];
  mentorContext?: {
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

  const interactivePractice =
    material.codeExample.language === "javascript"
      ? (
        <InteractiveCodePractice
          title={t("appShell.lessonContent.codeExample")}
          mode="javascript"
          initialCode={material.codeExample.code}
        />
      )
      : material.codeExample.language === "html" || material.codeExample.language === "css"
        ? (
          <InteractiveCodePractice
            title={t("appShell.lessonContent.codeExample")}
            mode="html-css"
            initialHtml={material.codeExample.language === "html" ? material.codeExample.code : "<h1>Hello</h1>\n<p>Welcome!</p>"}
            initialCss={material.codeExample.language === "css" ? material.codeExample.code : "h1 {\n  color: purple;\n}\np {\n  color: #333;\n}"}
          />
        )
        : null;

  const codeContext: {
    lessonTitle?: string;
    explanation?: string;
    code?: string;
    language?: string;
    output?: string;
    preview?: string;
    mode?: "javascript" | "html-css";
  } = {
    lessonTitle: mentorContext?.lesson || material.introduction || t("appShell.lessonContent.codeExample"),
    explanation: material.introduction,
    code: material.codeExample.code,
    language: material.codeExample.language,
    output: "",
    preview: "",
    mode: material.codeExample.language === "javascript" ? "javascript" : "html-css",
  };

  const shortIntro = material.introduction || "Learn the idea and try the example.";
  const shortExample = material.example || "Try the example below.";
  const shortPractice = material.practice[0] || "Change the value and run the code again.";
  const shortExplanation = material.codeExample.explanation || "This code shows the idea in a real example.";

  return (
    <article className="space-y-7 py-8 text-[var(--fg)]">
      {publishedNote.trim() && (
        <LessonSection title={t("appShell.lessonContent.publishedNote")}>
          <RichContent content={publishedNote} />
        </LessonSection>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)]">Define</h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--fg-muted)]">{shortIntro}</p>

        {material.audioPath || material.audioUrl ? (
          <SomaliLessonAudio
            audioUrl={material.audioUrl}
            audioPath={material.audioPath}
            title={t("content.listenInSomali")}
          />
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)]">Example</h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--fg-muted)]">{shortExample}</p>
        {interactivePractice ? (
          <div className="space-y-3">
            {interactivePractice}
            <div className="flex justify-end">
              <AskAIMentorButton
                context={mentorContext ?? {
                  learning_path_id: "",
                  learning_path: "",
                  course_id: "",
                  course: "",
                  module_id: "",
                  module: "",
                  lesson_id: "",
                  lesson: material.introduction || t("appShell.lessonContent.codeExample"),
                  lesson_level: "beginner",
                }}
                codeContext={codeContext}
              />
            </div>
          </div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)]">What happened?</h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--fg-muted)]">{shortExplanation}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)]">Practice</h2>
        <p className="max-w-2xl text-base leading-7 text-[var(--fg-muted)]">{shortPractice}</p>
      </section>

      {examples.length > 0 && (
        <LessonSection title={t("appShell.lessonContent.example")}>
          {examples.map((example, index) => (
            <div key={`${example.title}-${index}`} className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
              <RichContent content={`### ${example.title}\n\n${example.body}`} />
            </div>
          ))}
        </LessonSection>
      )}

      {displayedCodeExamples.length > 0 && (
        <LessonSection title={t("appShell.lessonContent.codeExample")}>
          {displayedCodeExamples.map((example, index) => (
            <div key={`${example.title}-${index}`} className="space-y-3">
              <CodeBlock code={example.code} language={example.language} filename={example.title} />
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
      )}

      {items.map(({ title, values }) => (
        <LessonSection key={title} title={title}>
          <ul className="space-y-2.5">
            {values.map((value, index) => (
              <li key={`${index}-${value}`} className="flex gap-3 text-sm leading-6 text-[var(--fg)]">
                <span aria-hidden="true" className="mt-0.5 font-bold text-[#7D288F] dark:text-purple-300">•</span>
                <RichContent content={value} className="min-w-0 flex-1" />
              </li>
            ))}
          </ul>
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
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-[var(--fg)]">{title}</h2>
      {children}
    </section>
  );
}
