"use client";

import Image from "next/image";
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

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white text-neutral-900 dark:bg-[#0A090E] dark:text-neutral-100 transition-colors"
    >
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-24">

        {/* Text Content Column */}
        <div className="flex flex-col justify-center lg:col-span-7">

          {/* Small label above title */}
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-neutral-100 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#7D288F] dark:bg-[#7D288F]/15 dark:text-purple-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7D288F]" />
            {t("hero.label")}
          </div>

          {/* Main Title */}
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-neutral-950 sm:text-6xl md:text-7xl lg:text-7xl dark:text-white leading-[1.05]">
            {t("hero.title").includes("AI") ? (
              <>
                {t("hero.title").split("AI")[0]}
                <span className="text-[#7D288F] dark:text-[#7D288F]">AI</span>
                {t("hero.title").split("AI")[1]}
              </>
            ) : (
              t("hero.title")
            )}
          </h1>

          {/* Main supporting headline */}
          <h2 className="mt-6 text-xl font-semibold text-neutral-800 sm:text-2xl lg:text-2xl dark:text-neutral-200">
            {t("hero.headline")}
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-400">
            {t("hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#learning-paths"
              className="inline-flex items-center gap-3 rounded-lg bg-[#7D288F] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#681f78] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]"
            >
              {t("hero.explorePaths")}
              <ArrowRight />
            </a>
            <a
              href="#ai-mentor"
              className="inline-flex items-center rounded-lg border border-neutral-300 px-7 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              {t("hero.meetMentor")}
            </a>
          </div>

          {/* Powered by Kaafiye Technology Center */}
          <div className="mt-14 flex items-center gap-4 border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
            <div className="relative h-10 w-10 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0">
              <Image
                src="/kafio.jpeg"
                alt="Kaafiye Technology Center"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {t("hero.poweredBy")}
              </div>
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-200">
                {t("hero.poweredByOrg")}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Photo Column */}
        <div className="flex justify-center lg:col-span-5">
          <div className="relative w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-neutral-200/60 shadow-2xl dark:border-neutral-800">
              <Image
                src="/hero-photo.jpg"
                alt="Developer learning technology"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl dark:ring-white/10" />
            </div>

            {/* Overlay badge */}
            <div className="absolute -bottom-6 -start-6 hidden sm:flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-neutral-800 dark:bg-[#121018]/95">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7D288F]/10 text-[#7D288F] dark:bg-[#7D288F]/20 dark:text-purple-300">
                <svg
                  width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {t("hero.structuredPaths")}
                </div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white">
                  {t("hero.badgeText")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}