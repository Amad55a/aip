"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("from-code-to-ai-theme", "dark");
        localStorage.setItem("theme", "dark");
      } catch { /* ignore */ }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("from-code-to-ai-theme", "light");
        localStorage.setItem("theme", "light");
      } catch { /* ignore */ }
    }
  };

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex shrink-0 items-center rounded-full border border-neutral-300 bg-neutral-100 p-0.5 h-7 w-12"
      >
        <span className="h-5 w-5 rounded-full bg-[#7D288F]" />
      </span>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={t(dark ? "common.switchToLightMode" : "common.switchToDarkMode")}
      onClick={toggle}
      className={`inline-flex items-center gap-3 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] ${
        showLabel ? "w-full justify-between py-2 text-sm font-medium" : "p-1"
      }`}
    >
      {showLabel && (
        <span className="text-neutral-700 dark:text-neutral-300">
          {dark ? `${t("common.dark")} ${t("common.theme")}` : `${t("common.light")} ${t("common.theme")}`}
        </span>
      )}

      {/* Toggle Track */}
      <span className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-neutral-300 bg-neutral-100 p-0.5 transition-colors duration-200 ease-in-out dark:border-neutral-600 dark:bg-neutral-700">
        {/* Knob */}
        <span
          className={`pointer-events-none grid h-5 w-5 transform place-items-center rounded-full bg-[#7D288F] text-white shadow-sm transition-transform duration-200 ease-in-out ${
            dark ? "translate-x-5" : "translate-x-0"
          }`}
        >
          {dark ? (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}