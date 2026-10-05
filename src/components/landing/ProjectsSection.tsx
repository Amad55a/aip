"use client";

import { useLanguage } from "@/hooks/useLanguage";

const PROJECT_KEYS = ["mern", "ai", "cyber", "english"] as const;
const DIFFICULTY_KEYS: Record<string, "intermediate" | "advanced" | "foundational"> = {
  mern:    "intermediate",
  ai:      "advanced",
  cyber:   "intermediate",
  english: "foundational",
};

export default function ProjectsSection() {
  const { t } = useLanguage();

  return (
    <section
      id="projects"
      className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-[#0A090E] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-widest text-[#7D288F] uppercase dark:text-purple-400">
            {t("projects.sectionLabel")}
          </div>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
            {t("projects.heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t("projects.description")}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {PROJECT_KEYS.map((key) => (
            <div
              key={key}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-8 transition-all hover:border-[#7D288F]/40 hover:bg-white hover:shadow-lg dark:border-neutral-800 dark:bg-[#121018] dark:hover:border-purple-500/40 dark:hover:bg-[#171422]"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7D288F] dark:text-purple-400">
                    {t(`projects.items.${key}.path`)}
                  </span>
                  <span className="rounded-full bg-neutral-200/70 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {t(`projects.difficulty.${DIFFICULTY_KEYS[key]}`)}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-neutral-900 group-hover:text-[#7D288F] dark:text-white dark:group-hover:text-purple-300 transition-colors">
                  {t(`projects.items.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`projects.items.${key}.description`)}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-[#7D288F] dark:text-purple-400">
                <span>{t("projects.viewSpec")}</span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Section Action */}
        <div className="mt-12 flex justify-start">
          <a
            href="#learning-paths"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7D288F] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#681f78] transition"
          >
            {t("projects.exploreProjects")}
          </a>
        </div>
      </div>
    </section>
  );
}
