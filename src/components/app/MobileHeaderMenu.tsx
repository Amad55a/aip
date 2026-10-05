"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/landing/ThemeToggle";
import UserMenu from "@/components/app/UserMenu";
import { useLanguage } from "@/hooks/useLanguage";

const LINKS = [
  { href: "/dashboard", key: "appShell.nav.dashboard" },
  { href: "/learn", key: "appShell.nav.learn" },
  { href: "/projects", key: "appShell.nav.projects" },
];

export default function MobileHeaderMenu() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="relative order-2 ms-auto md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-header-menu"
        aria-label={t("navbar.toggleNav")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <div
          id="mobile-header-menu"
          className="absolute end-0 top-full z-50 mt-2 max-h-[calc(100dvh-6rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl"
        >
          <nav aria-label={t("navbar.toggleNav")} className="space-y-1">
            {LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className="block rounded-lg px-3 py-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 space-y-3 border-t border-[var(--border)] pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--fg)]">{t("common.language")}</span>
              <LanguageSwitcher />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--fg)]">{t("common.theme")}</span>
              <ThemeToggle showLabel />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
              <span className="text-sm font-semibold text-[var(--fg)]">{t("appShell.profile")}</span>
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
