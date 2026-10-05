"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { t } = useLanguage();

  const FOOTER_CATEGORIES = [
    {
      title: t("footer.categories.learn"),
      links: [
        { label: t("footer.links.learningPaths"), href: "#learning-paths" },
        { label: t("footer.links.learn"), href: "#learn" },
        { label: t("footer.links.projects"), href: "#projects" },
        { label: t("footer.links.progress"), href: "#" },
      ],
    },
    {
      title: t("footer.categories.platform"),
      links: [
        { label: t("footer.links.aiMentor"), href: "#ai-mentor" },
        { label: t("footer.links.dashboard"), href: "#" },
        { label: t("footer.links.roadmap"), href: "#" },
      ],
    },
    {
      title: t("footer.categories.company"),
      links: [
        { label: t("footer.links.about"), href: "#" },
        { label: t("footer.links.contact"), href: "#" },
      ],
    },
    {
      title: t("footer.categories.account"),
      links: [
        { label: t("footer.links.signIn"), href: "/signin" },
        { label: t("footer.links.getStarted"), href: "#learning-paths" },
      ],
    },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#0a090e] transition-colors">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        {/* Top Row: Brand + Columns */}
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7D288F] text-white shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="text-lg font-bold text-neutral-900 dark:text-white">TechPath AI</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t("footer.tagline")}
            </p>

            {/* KTC Branding */}
            <div className="mt-8 flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-[#121018]">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
                <Image
                  src="/kafio.jpeg"
                  alt="Kaafiye Technology Center logo"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{t("footer.poweredBy")}</p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{t("hero.poweredByOrg")}</p>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {FOOTER_CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  {cat.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {cat.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-700 hover:text-[#7D288F] dark:text-neutral-300 dark:hover:text-purple-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:flex-row sm:items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            {t("footer.copyright")} {t("footer.allRightsReserved")}
          </p>
          <p className="text-sm text-neutral-400 dark:text-neutral-600">
            {t("footer.builtWithPurpose")}
          </p>
        </div>
      </div>
    </footer>
  );
}
