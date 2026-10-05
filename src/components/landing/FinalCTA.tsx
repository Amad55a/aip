"use client";

import { useLanguage } from "@/hooks/useLanguage";

function ArrowRight() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#7D288F] text-white py-24 transition-colors relative overflow-hidden">
      {/* Subtle background depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
          {t("finalCta.heading")}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-purple-100 sm:text-xl leading-relaxed">
          {t("finalCta.description")}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#learning-paths"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold text-[#7D288F] shadow-lg hover:bg-neutral-100 transition-colors"
          >
            <span>{t("finalCta.getStarted")}</span>
            <ArrowRight />
          </a>
          <a
            href="#learning-paths"
            className="inline-flex items-center rounded-lg border border-white/40 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur hover:bg-white/20 transition-colors"
          >
            {t("finalCta.explorePaths")}
          </a>
        </div>
      </div>
    </section>
  );
}
