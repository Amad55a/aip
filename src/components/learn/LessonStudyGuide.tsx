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

type LessonFlowPhase = {
  id: "learn" | "see" | "practice";
  title: string;
  summary: string;
  content?: string;
  code?: string;
  language?: string;
  tasks?: string[];
  audio_url?: string | null;
  audio_path?: string | null;
  audio_language?: "so" | null;
};

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
  const fallbackPhaseSections: LessonFlowPhase[] = [
    { id: "learn", title: "Learn", summary: "Understand the idea", content: material.explanation },
    { id: "see", title: "See", summary: "Look at a simple example", content: material.example, code: material.codeExample.code, language: material.codeExample.language },
    { id: "practice", title: "Practice", summary: "Try a short task", content: material.practice[0] ?? material.example, tasks: material.practice },
  ];
  const phaseLabels: LessonFlowPhase[] = (material.phaseSections?.length ? material.phaseSections : fallbackPhaseSections).map((phase) => ({
    ...phase,
    id: phase.id as "learn" | "see" | "practice",
    title: phase.title.replace(/\s*·\s*.*$/, "").trim() || phase.title,
    content: phase.content ?? "",
    code: phase.code,
    language: phase.language,
    tasks: phase.tasks,
  }));
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
    explanation: material.explanation,
    code: material.codeExample.code,
    language: material.codeExample.language,
    output: "",
    preview: "",
    mode: material.codeExample.language === "javascript" ? "javascript" : "html-css",
  };

  return (
    <article className="space-y-8 py-8 text-[var(--fg)]">
      {publishedNote.trim() && (
        <LessonSection title={t("appShell.lessonContent.publishedNote")}>
          <RichContent content={publishedNote} />
        </LessonSection>
      )}

      <section className="space-y-6">
        <div className="border-b border-[var(--border)] pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--fg-muted)]">Lesson flow</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {phaseLabels.map((phase) => (
            <div key={phase.id} className="border-l border-[var(--border)] pl-4 md:border-l-0 md:border-t md:pt-4 md:pl-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-muted)]">{phase.title}</p>
              <h3 className="mt-2 text-lg font-bold text-[var(--fg)]">{phase.summary}</h3>
              <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--fg-muted)]">
                {phase.content ? <RichContent content={phase.content} className="[&_p]:mb-0 [&_p]:text-[var(--fg-muted)]" /> : null}
                {phase.code ? (
                  <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                    <CodeBlock code={phase.code} language={phase.language ?? "javascript"} filename={phase.title} />
                  </div>
                ) : null}
                {phase.tasks?.length ? (
                  <ul className="space-y-2">
                    {phase.tasks.map((task, index) => (
                      <li key={`${phase.id}-task-${index}`} className="flex gap-2">
                        <span className="mt-1 text-[#7D288F] dark:text-purple-300">•</span>
                        <RichContent content={task} className="min-w-0 flex-1 [&_p]:mb-0 [&_p]:text-[var(--fg-muted)]" />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {interactivePractice ? (
        <LessonSection title={t("appShell.lessonContent.codeExample")}>
          <div className="space-y-3">
            {material.audioPath || material.audioUrl ? (
              <SomaliLessonAudio
                audioUrl={material.audioUrl}
                audioPath={material.audioPath}
                title={t("content.listenInSomali")}
              />
            ) : null}
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
        </LessonSection>
      ) : null}

      <LessonSection title={t("appShell.lessonContent.concept")}>
        <RichContent content={material.explanation} />
      </LessonSection>

      <LessonSection title={t("appShell.lessonContent.terminology")}>
        <dl className="grid gap-3 md:grid-cols-2">
          {material.terminology.map((entry) => (
            <div key={entry.term} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <dt className="text-sm font-bold text-[var(--fg)]">{entry.term}</dt>
              <dd className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">{entry.definition}</dd>
              {entry.example ? <p className="mt-2 text-xs leading-5 text-[var(--fg-muted)]">Example: {entry.example}</p> : null}
            </div>
          ))}
        </dl>
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
      <h2 className="mb-4 text-xl font-semibold tracking-tight text-[var(--fg)]">{title}</h2>
      {children}
    </section>
  );
}
