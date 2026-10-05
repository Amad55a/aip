"use client";

import { useState } from "react";

const stages = [
  { name: "Foundations", goal: "Build and version your first web pages.", topics: ["HTML", "CSS", "JavaScript", "Git"] },
  { name: "Frontend", goal: "Create real interfaces with modern tools.", topics: ["React", "TypeScript", "Next.js"] },
  { name: "Backend", goal: "Make your apps store data and know who is using them.", topics: ["APIs", "Authentication", "Databases"] },
  { name: "Engineering", goal: "Ship software that is safe, tested and maintainable.", topics: ["Security", "Testing", "DevOps", "System Design"] },
  { name: "AI", goal: "Add intelligence to the software you build.", topics: ["AI APIs", "LLMs", "RAG", "Agents", "AI Applications"] },
];

export default function RoadmapSection() {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return (
    <section id="roadmap" className="border-t border-[var(--line)] bg-[var(--tint)]">
      <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
        <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-[clamp(2.5rem,6.5vw,6rem)] leading-[1.02] tracking-[-0.025em]">
          From Fundamentals to Modern Engineering
        </h2>
        <p className="mt-6 max-w-md text-[var(--muted)]">Start at the first stage and move forward at your own pace. Select a stage to see what it covers.</p>

        <div className="mt-14 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:mt-20 lg:grid-cols-12">
          <div role="tablist" aria-orientation="vertical" aria-label="Roadmap stages" className="bg-[var(--bg)] lg:col-span-5">
            {stages.map((s, i) => (
              <button
                key={s.name}
                role="tab"
                id={`stage-${i}`}
                aria-selected={active === i}
                aria-controls="stage-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={`flex w-full items-baseline gap-5 border-b border-[var(--line)] px-5 py-5 text-start transition-colors last:border-b-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--brand)] md:px-8 md:py-7 ${
                  active === i ? "bg-[var(--brand)] text-white" : "hover:bg-[var(--tint)]"
                }`}
              >
                <span className="w-8 text-sm tabular-nums opacity-70">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-[family-name:var(--font-display)] text-3xl tracking-tight md:text-5xl">{s.name}</span>
              </button>
            ))}
          </div>

          <div
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`stage-${active}`}
            className="flex min-h-[22rem] flex-col justify-between bg-[var(--bg)] p-6 md:p-12 lg:col-span-7"
          >
            <div key={active} className="rise">
              <p className="text-sm text-[var(--muted)]">Stage {active + 1} of {stages.length}</p>
              <p className="mt-3 max-w-md text-xl font-medium md:text-2xl">{stage.goal}</p>
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-[family-name:var(--font-display)] text-4xl tracking-tight md:text-6xl">
                {stage.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="mt-10" aria-hidden="true">
              <div className="h-1 w-full bg-[var(--line)]">
                <div className="h-full bg-[var(--brand)] transition-all duration-500" style={{ width: `${((active + 1) / stages.length) * 100}%` }} />
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">
                {active < stages.length - 1 ? `Next: ${stages[active + 1].name}` : "You are building with AI"}
              </p>
            </div>
          </div>
        </div>

        <a href="#" className="mt-12 inline-block rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]">
          Explore the Full Roadmap
        </a>
      </div>
    </section>
  );
}