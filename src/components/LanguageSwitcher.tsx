"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGES, LANGUAGE_LABELS, type Language } from "@/i18n";

interface LanguageSwitcherProps {
  /** When true, shows a compact icon-only trigger (for tight spaces). */
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const instanceId = useId().replaceAll(":", "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative" dir={isRTL ? "rtl" : "ltr"}>
      {/* Trigger Button */}
      <button
        id={`${instanceId}-btn`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("languageSwitcher.label")}
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white/80 text-sm font-medium text-neutral-700 transition-all hover:border-[#7D288F]/50 hover:text-[#7D288F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:border-purple-500/50 dark:hover:text-purple-300 ${
          compact ? "h-9 px-2.5" : "h-9 px-3"
        }`}
      >
        {/* Globe Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>

        {/* Current Language Label */}
        {!compact && (
          <span className="max-w-[5rem] truncate">
            {LANGUAGE_LABELS[language]}
          </span>
        )}

        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label={t("languageSwitcher.label")}
          aria-activedescendant={`${instanceId}-option-${language}`}
          className="absolute end-0 top-full z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-[#1a1825]"
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang === language;
            return (
              <button
                key={lang}
                id={`${instanceId}-option-${lang}`}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => handleSelect(lang)}
                dir={lang === "ar" ? "rtl" : "ltr"}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7D288F] ${
                  isActive
                    ? "bg-[#7D288F]/10 font-semibold text-[#7D288F] dark:bg-[#7D288F]/20 dark:text-purple-300"
                    : "text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{LANGUAGE_LABELS[lang]}</span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
