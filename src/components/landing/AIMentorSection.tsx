"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function AIMentorSection() {
  const { t } = useLanguage();

  return (
    <section
      id="ai-mentor"
      className="border-t border-neutral-200 bg-neutral-50/50 py-24 dark:border-neutral-800 dark:bg-[#0E0C13] transition-colors"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Heading & Core Text */}
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold tracking-widest text-[#7D288F] uppercase dark:text-purple-400">
              {t("aiMentor.sectionLabel")}
            </div>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl dark:text-white leading-[1.1]">
              {t("aiMentor.heading")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t("aiMentor.description")}
            </p>

            {/* Philosophy Highlight Box */}
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-[#121018] shadow-sm">
              <div className="flex items-center gap-3 text-[#7D288F] dark:text-purple-400 mb-2">
                <svg
                  width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t("aiMentor.philosophyLabel")}
                </span>
              </div>
              <blockquote className="text-base font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                {t("aiMentor.quote")}
              </blockquote>
            </div>
          </div>

          {/* Right Column: AI Mentor UI Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-[#121018] overflow-hidden">

              {/* Header Context Bar */}
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-200 bg-neutral-100/70 px-6 py-4 dark:border-neutral-800 dark:bg-[#181522]">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7D288F] text-white">
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {t("aiMentor.activePath")}
                    </div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">
                      MERN Stack Web Development
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-md bg-neutral-200/80 px-2.5 py-1 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {t("aiMentor.topic")}: <strong className="font-semibold text-neutral-900 dark:text-white">React Hooks</strong>
                  </span>
                  <span className="rounded-md bg-[#7D288F]/10 px-2.5 py-1 font-semibold text-[#7D288F] dark:bg-[#7D288F]/20 dark:text-purple-300">
                    {t("aiMentor.difficulty")}
                  </span>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-6 space-y-5">
                {/* User Question */}
                <div className="flex items-start justify-end gap-3">
                  <div className="max-w-md rounded-2xl rounded-tr-none bg-[#7D288F] px-4 py-3 text-sm text-white shadow-sm">
                    {t("aiMentor.userQuestion")}
                  </div>
                </div>

                {/* AI Mentor Response */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7D288F]/15 text-[#7D288F] dark:bg-[#7D288F]/30 dark:text-purple-300 mt-1">
                    <svg
                      width="16" height="16" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div className="space-y-3 rounded-2xl rounded-tl-none border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm dark:border-neutral-800 dark:bg-[#171422] text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    <p className="font-semibold text-neutral-950 dark:text-white">
                      {t("aiMentor.aiResponseHeadline")}
                    </p>
                    <p>
                      {t("aiMentor.aiResponseBody")}
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-neutral-300 bg-neutral-800 p-3.5 font-mono text-xs text-neutral-200 dark:border-neutral-700 dark:bg-neutral-950">
                      <span className="text-purple-400">useEffect</span>(() =&gt; &#123;<br />
                      &nbsp;&nbsp;<span className="text-neutral-400">{"// 1. Code runs after render"}</span><br />
                      &nbsp;&nbsp;fetchData();<br />
                      &#125;, []); <span className="text-neutral-400">{"// 2. [] = run once on mount"}</span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                      {t("aiMentor.aiTip")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
