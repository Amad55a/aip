"use client";

import { useLanguage } from "@/hooks/useLanguage";

const CONCEPT_KEYS = ["01", "02", "03", "04"] as const;

export default function LearnSection() {
  const { t } = useLanguage();

  return (
    <section
      id="learn"
      className="border-t border-neutral-200 bg-white py-24 dark:border-neutral-800 dark:bg-[#0A090E] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header — Editorial Layout */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="text-xs font-semibold tracking-widest text-[#7D288F] uppercase dark:text-purple-400">
              {t("learn.sectionLabel")}
            </div>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
              {t("learn.heading")}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t("learn.description")}
            </p>
          </div>
        </div>

        {/* Editorial Grid List */}
        <div className="mt-16 grid gap-px bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4 dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
          {CONCEPT_KEYS.map((num) => (
            <div
              key={num}
              className="flex flex-col justify-between bg-white p-8 dark:bg-[#121018] transition hover:bg-neutral-50 dark:hover:bg-[#181520] group"
            >
              <div>
                <span className="text-sm font-bold text-[#7D288F] dark:text-purple-400 tracking-wider">
                  {num}
                </span>
                <h3 className="mt-4 text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#7D288F] dark:group-hover:text-purple-300 transition-colors">
                  {t(`learn.concepts.${num}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t(`learn.concepts.${num}.description`)}
                </p>
              </div>
              <div className="mt-8 h-1 w-12 bg-neutral-200 group-hover:bg-[#7D288F] transition-colors dark:bg-neutral-800 dark:group-hover:bg-purple-400" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-start">
          <a
            href="#learning-paths"
            className="inline-flex items-center gap-2 text-base font-semibold text-[#7D288F] hover:text-[#681f78] dark:text-purple-400 dark:hover:text-purple-300 group"
          >
            <span>{t("learn.exploreLink")}</span>
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
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
