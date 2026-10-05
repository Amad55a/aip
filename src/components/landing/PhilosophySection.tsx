"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function PhilosophySection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-neutral-200 bg-neutral-950 py-32 text-white transition-colors dark:border-neutral-800 dark:bg-[#060508]">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-12">
        {/* Subtitle */}
        <div className="text-xs font-semibold uppercase tracking-widest text-purple-400">
          {t("philosophy.sectionLabel")}
        </div>

        {/* Large Main Statement */}
        <h2 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-6xl">
          {t("philosophy.heading")}
        </h2>

        {/* Supporting 4-line breakdown */}
        <div className="mx-auto mt-12 max-w-xl space-y-3 text-lg font-medium text-neutral-300 sm:text-xl">
          <p>{t("philosophy.line1")}</p>
          <p className="font-semibold text-purple-300">{t("philosophy.line2")}</p>
          <p>{t("philosophy.line3")}</p>
          <p className="text-neutral-400">{t("philosophy.line4")}</p>
        </div>

        {/* Closing Statement */}
        <div className="mx-auto mt-16 max-w-2xl border-t border-neutral-800 pt-10">
          <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t("philosophy.closing")}
          </p>
        </div>
      </div>
    </section>
  );
}
