"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

function IconLearn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconProjects() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

const ITEMS = [
  {
    href: "/learn",
    icon: IconLearn,
    titleKey: "appShell.explore.learn.title",
    descKey: "appShell.explore.learn.description",
  },
  {
    href: "/projects",
    icon: IconProjects,
    titleKey: "appShell.explore.projects.title",
    descKey: "appShell.explore.projects.description",
  },
];

export default function QuickNavigation() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="explore-heading">
      <h2
        id="explore-heading"
        className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)]"
      >
        {t("appShell.explore.heading")}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITEMS.map(({ href, icon: Icon, titleKey, descKey }) => (
          <Link
            key={href}
            href={href}
            className="
              group flex flex-col gap-3
              rounded-xl border border-[var(--border)]
              bg-[var(--surface)]
              p-5
              transition-colors
              hover:border-[var(--brand-border)] hover:bg-[var(--brand-soft)]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]
            "
          >
            <span className="
              flex h-9 w-9 items-center justify-center rounded-lg
              bg-[var(--brand-soft)] text-[#7D288F]
              group-hover:bg-[#7D288F] group-hover:text-white
              dark:text-purple-300 dark:group-hover:text-white
              transition-colors
            ">
              <Icon />
            </span>
            <span>
              <span className="block text-sm font-bold text-[var(--fg)]">
                {t(titleKey)}
              </span>
              <span className="mt-0.5 block text-xs text-[var(--fg-muted)]">
                {t(descKey)}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
