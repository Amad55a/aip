"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/landing/ThemeToggle";
import UserMenu from "@/components/app/UserMenu";
import AppSearch from "@/components/app/AppSearch";
import MobileHeaderMenu from "@/components/app/MobileHeaderMenu";
import { useLanguage } from "@/hooks/useLanguage";

/* ─── Brand Logo ─────────────────────────────────────────────────── */
function BrandLogo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 shrink-0 group"
      aria-label="TechPath AI — Dashboard"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7D288F] text-white shadow-sm transition-transform group-hover:scale-105">
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <span className="text-sm font-bold tracking-tight text-[var(--fg)] whitespace-nowrap">
        TechPath AI
      </span>
    </Link>
  );
}

/* ─── Component ──────────────────────────────────────────────────── */
export default function AppHeader() {
  const { t } = useLanguage();

  return (
    <header
      className="
        sticky top-0 z-40
        flex min-h-16 flex-wrap items-center gap-3 py-3 md:h-16 md:flex-nowrap md:py-0
        border-b border-[var(--border)]
        bg-[var(--bg)]/90 backdrop-blur-md
        px-4 sm:px-6
        transition-colors
        shrink-0
      "
    >
      {/* LEFT — Brand logo (always visible) */}
      <BrandLogo />

      <MobileHeaderMenu />

      <div className="order-3 flex w-full items-center gap-2 md:order-2 md:w-auto">
        <div className="min-w-0 flex-1 md:flex-none">
          <AppSearch mobileFullWidth />
        </div>
        <Link
          href="/web-search"
          className="hidden min-h-9 shrink-0 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--fg)] transition-colors hover:border-[var(--brand-border)] hover:text-[#7D288F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] md:inline-flex"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
          </svg>
          <span>{t("appShell.webSearch.title")}</span>
        </Link>
      </div>

      <div className="ms-auto hidden items-center gap-2 sm:gap-3 md:order-3 md:flex">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
