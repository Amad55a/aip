"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function LearningBanner() {
  const { t } = useLanguage();

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        border border-[var(--brand-border)]
        bg-[var(--brand-soft)]
        px-8 py-10 sm:px-12 sm:py-12
      "
    >
      {/* Subtle geometric accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute end-0 top-0 h-full w-1/3 opacity-[0.04]"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, #7D288F 0%, transparent 70%)",
        }}
      />

      {/* Label */}
      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#7D288F] dark:text-purple-400">
        From Code to AI
      </p>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fg)] leading-tight max-w-lg">
        {t("appShell.banner.heading")}
      </h2>

      {/* Body */}
      <p className="mt-3 text-sm sm:text-base text-[var(--fg-muted)] max-w-md leading-relaxed">
        {t("appShell.banner.body")}
      </p>

      {/* CTA */}
      <Link
        href="/learn"
        className="
          mt-8 inline-flex items-center gap-2
          rounded-lg bg-[#7D288F] px-5 py-2.5
          text-sm font-bold text-white shadow-sm
          hover:bg-[#681f78]
          transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]
        "
      >
        {t("appShell.banner.cta")}
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          className="rtl:rotate-180"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
