"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const NAV_LINKS = [
    { labelKey: "navbar.home",          href: "#home" },
    { labelKey: "navbar.learn",         href: "#learn" },
    { labelKey: "navbar.aiMentor",      href: "#ai-mentor" },
    { labelKey: "navbar.projects",      href: "#projects" },
    { labelKey: "navbar.learningPaths", href: "#learning-paths" },
    { labelKey: "navbar.howItWorks",    href: "#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 text-neutral-900 backdrop-blur-md dark:border-neutral-800/80 dark:bg-[#0A090E]/90 dark:text-neutral-100 transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Left Side: Brand Logo + Desktop Nav */}
        <div className="flex items-center">
          {/* Brand Logo */}
          <Link
            href="#home"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-neutral-900 dark:text-white shrink-0 group ltr:mr-6 rtl:ml-6 lg:ltr:mr-10 lg:rtl:ml-10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7D288F] text-white shadow-sm transition-transform group-hover:scale-105">
              <svg
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <span className="whitespace-nowrap">TechPath AI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-2.5 lg:flex xl:gap-5" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="whitespace-nowrap text-xs xl:text-sm font-medium text-neutral-600 transition-colors hover:text-[#7D288F] dark:text-neutral-300 dark:hover:text-white"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side: Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex xl:gap-3 shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-xs xl:text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition whitespace-nowrap"
              >
                {t("navbar.dashboard")}
              </Link>
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2 text-xs xl:text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition whitespace-nowrap"
              >
                {t("navbar.profile")}
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs xl:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-[#14121C] dark:text-neutral-200 dark:hover:bg-neutral-800 transition whitespace-nowrap"
              >
                {t("navbar.signOut")}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-xs xl:text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-neutral-800 transition whitespace-nowrap"
              >
                {t("navbar.signIn")}
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#7D288F] px-3.5 xl:px-5 py-2.5 text-xs xl:text-sm font-semibold text-white shadow-sm hover:bg-[#681f78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] transition whitespace-nowrap"
              >
                {t("navbar.getStarted")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          aria-label={t("navbar.toggleNav")}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <svg
            width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-200 bg-white px-6 pb-6 pt-4 dark:border-neutral-800 dark:bg-[#0A090E] lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-100 hover:text-[#7D288F] dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <div className="px-3 flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {t("common.language")}
              </span>
              <LanguageSwitcher />
            </div>

            <div className="px-3">
              <ThemeToggle showLabel />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {t("navbar.dashboard")}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {t("navbar.profile")}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void signOut();
                    }}
                    className="flex items-center justify-center rounded-lg bg-[#7D288F] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#681f78]"
                  >
                    {t("navbar.signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 text-center text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {t("navbar.signIn")}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center rounded-lg bg-[#7D288F] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#681f78]"
                  >
                    {t("navbar.getStarted")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}