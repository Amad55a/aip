"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

/* ─── Icons ─────────────────────────────────────────────────────── */
function IconDashboard({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
function IconLearn({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function IconProjects({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}
/* ─── Nav config ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/dashboard", icon: IconDashboard, labelKey: "appShell.nav.dashboard" },
  { href: "/learn",     icon: IconLearn,     labelKey: "appShell.nav.learn" },
  { href: "/projects",  icon: IconProjects,  labelKey: "appShell.nav.projects" },
];

/* ─── Component ──────────────────────────────────────────────────── */
export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside
      aria-label="Sidebar navigation"
      className="
        hidden md:flex flex-col
        w-52 shrink-0
        border-e border-[var(--border)]
        bg-[var(--bg)]
        transition-colors
        pt-3
      "
    >
      <nav className="flex-1 px-3 space-y-0.5" aria-label="App navigation">
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-colors
                focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7D288F]
                ${
                  isActive
                    ? "bg-[var(--brand-soft)] text-[#7D288F] dark:text-purple-300"
                    : "text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]"
                }
              `}
            >
              <Icon
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-[#7D288F] dark:text-purple-300"
                    : "text-[var(--fg-muted)] group-hover:text-[var(--fg)]"
                }`}
              />
              <span>{t(labelKey)}</span>
              {isActive && (
                <span
                  aria-hidden="true"
                  className="ms-auto h-1.5 w-1.5 rounded-full bg-[#7D288F] dark:bg-purple-400"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
