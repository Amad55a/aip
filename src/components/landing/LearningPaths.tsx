"use client";

import { useLanguage } from "@/hooks/useLanguage";

const PATH_KEYS = ["01", "02", "03", "04"] as const;
const LEVEL_KEYS: Record<string, keyof { foundationalToAdvanced: string; intermediate: string; allLevels: string; coreSkill: string }> = {
  "01": "foundationalToAdvanced",
  "02": "intermediate",
  "03": "allLevels",
  "04": "coreSkill",
};

export default function LearningPaths() {
  const { t } = useLanguage();

  return (
    <section
      id="learning-paths"
      className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-[#0A090E] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-widest text-[#7D288F] uppercase dark:text-purple-400">
            {t("learningPaths.sectionLabel")}
          </div>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
            {t("learningPaths.heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t("learningPaths.description")}
          </p>
        </div>

        {/* Learning Paths Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {PATH_KEYS.map((num) => (
            <div
              key={num}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-neutral-50/60 p-8 transition-all duration-300 hover:border-[#7D288F]/50 hover:bg-white hover:shadow-xl dark:border-neutral-800 dark:bg-[#121018] dark:hover:border-purple-500/50 dark:hover:bg-[#171422]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#7D288F] dark:text-purple-400">
                    {num}
                  </span>
                  <span className="rounded-full bg-neutral-200/80 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {t(`learningPaths.levels.${LEVEL_KEYS[num]}`)}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-neutral-900 group-hover:text-[#7D288F] dark:text-white dark:group-hover:text-purple-300 transition-colors">
                  {t(`learningPaths.paths.${num}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`learningPaths.paths.${num}.description`)}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {t("learningPaths.explorePath")}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 group-hover:bg-[#7D288F] group-hover:text-white transition-colors dark:bg-neutral-800 dark:text-neutral-300">
                  <svg
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-start">
          <a
            href="#learning-paths"
            className="inline-flex items-center gap-2 rounded-lg bg-[#7D288F] px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#681f78] transition"
          >
            <span>{t("learningPaths.viewAll")}</span>
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
