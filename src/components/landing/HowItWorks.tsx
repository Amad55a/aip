"use client";

import { useLanguage } from "@/hooks/useLanguage";

const STEP_KEYS = ["01", "02", "03", "04"] as const;

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section
      id="how-it-works"
      className="border-t border-neutral-200 bg-neutral-50/50 py-24 dark:border-neutral-800 dark:bg-[#0E0C13] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-widest text-[#7D288F] uppercase dark:text-purple-400">
            {t("howItWorks.sectionLabel")}
          </div>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
            {t("howItWorks.heading")}
          </h2>
        </div>

        {/* 4 Step Connected Sequence */}
        <div className="relative mt-16">
          {/* Connector line for desktop */}
          <div
            className="absolute top-12 start-0 hidden h-0.5 w-full bg-neutral-200 dark:bg-neutral-800 lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_KEYS.map((step, index) => (
              <div
                key={step}
                className="relative z-10 flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-[#121018] shadow-sm transition hover:border-[#7D288F]/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-[#7D288F] dark:text-purple-400 tracking-tight">
                      {step}
                    </span>
                    <span className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {t("howItWorks.stepLabel")} {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {t(`howItWorks.steps.${step}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {t(`howItWorks.steps.${step}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
