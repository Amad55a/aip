"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function AppFooter() {
  const { t } = useLanguage();

  const links = [
    { label: t("appShell.footer.learn"), href: "/learn" },
    { label: t("appShell.footer.projects"), href: "/projects" },
    { label: t("appShell.footer.profile"), href: "/profile" },
  ];

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--bg)] transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-6 pb-24 sm:flex-row sm:items-center sm:justify-between md:pb-6">
        {/* Brand + tagline */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-[var(--fg)]">TechPath AI</p>
          <p className="text-xs text-[var(--fg-muted)]">{t("appShell.footer.tagline")}</p>
          <p className="text-xs text-[var(--fg-muted)]">
            {t("appShell.footer.copyright")}
          </p>
        </div>

        {/* Footer nav */}
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-[var(--fg-muted)] transition-colors hover:text-[#7D288F] dark:hover:text-purple-300"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
