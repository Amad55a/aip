"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";

/* ─── Icons ─────────────────────────────────────────────────────── */
function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
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
const NAV_ITEMS = [
  { href: "/dashboard", icon: IconDashboard, labelKey: "appShell.nav.dashboard" },
  { href: "/learn",     icon: IconLearn,     labelKey: "appShell.nav.learn" },
  { href: "/projects",  icon: IconProjects,  labelKey: "appShell.nav.projects" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed bottom-0 inset-x-0 z-40
        flex md:hidden
        border-t border-[var(--border)]
        bg-[var(--bg)]/95 backdrop-blur-md
      "
    >
      {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`
              flex flex-1 flex-col items-center gap-1 py-3 px-1
              text-[10px] font-medium transition-colors
              ${isActive ? "text-[#7D288F] dark:text-purple-300" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}
            `}
          >
            <Icon />
            <span className="truncate">{t(labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
