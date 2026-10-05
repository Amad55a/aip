"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/hooks/useLanguage";

type SearchResult = {
  id: string;
  type: "lesson" | "module" | "course" | "project" | "learningPath";
  title: string;
  description: string;
  href: string;
  context: string;
};

const RECENT_SEARCHES_KEY = "from-code-to-ai-recent-searches";
const RESULT_TYPES: SearchResult["type"][] = ["lesson", "module", "course", "project", "learningPath"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSearchResult(value: unknown): value is SearchResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.id === "string" &&
    typeof result.title === "string" &&
    typeof result.description === "string" &&
    typeof result.href === "string" &&
    typeof result.context === "string" &&
    (result.type === "lesson" ||
      result.type === "module" ||
      result.type === "course" ||
      result.type === "project" ||
      result.type === "learningPath")
  );
}

export default function AppSearch({ mobileFullWidth = false }: { mobileFullWidth?: boolean }) {
  const { t, language, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [usedEnglishFallback, setUsedEnglishFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item): item is string => typeof item === "string").slice(0, 5));
      }
    } catch {
      setRecentSearches([]);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setUsedEnglishFallback(false);
      setError("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&language=${language}`, {
          signal: controller.signal,
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const message =
            isRecord(payload) &&
            typeof payload.error === "string"
              ? payload.error
              : t("appShell.globalSearch.error");
          throw new Error(message);
        }

        const rawResults = isRecord(payload) ? payload.results : null;
        if (!Array.isArray(rawResults) || !rawResults.every(isSearchResult)) {
          throw new Error(t("appShell.globalSearch.error"));
        }
        setResults(rawResults);
        setUsedEnglishFallback(
          isRecord(payload) && payload.usedEnglishFallback === true
        );
      } catch (searchError) {
        if (controller.signal.aborted) return;
        setError(
          searchError instanceof Error
            ? searchError.message
            : t("appShell.globalSearch.error")
        );
        setResults([]);
        setUsedEnglishFallback(false);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [language, query, t]);

  const groupedResults = useMemo(
    () =>
      RESULT_TYPES.map((type) => ({
        type,
        results: results.filter((result) => result.type === type),
      })).filter((group) => group.results.length > 0),
    [results]
  );

  function rememberSearch() {
    const term = query.trim();
    if (!term) return;
    const updated = [term, ...recentSearches.filter((item) => item !== term)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      setError(t("appShell.globalSearch.error"));
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("appShell.searchLabel")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 text-sm text-[var(--fg-muted)] transition-colors hover:border-[var(--brand-border)] hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] ${mobileFullWidth ? "w-full justify-start md:w-auto md:justify-center" : ""}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="hidden whitespace-nowrap sm:block">{t("appShell.search")}</span>
        <span className="ms-1 hidden items-center rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-muted)] lg:inline-flex">
          ⌘K
        </span>
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/45 px-4 pt-[12vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-label={t("appShell.globalSearch.title")}
            aria-modal="true"
            dir={isRTL ? "rtl" : "ltr"}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[var(--fg-muted)]">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <label className="sr-only" htmlFor="global-search-input">{t("appShell.globalSearch.title")}</label>
              <input
                id="global-search-input"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("appShell.globalSearch.placeholder")}
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-[var(--border)] px-2 py-1 font-mono text-[10px] text-[var(--fg-muted)] transition hover:text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
              >
                Esc
              </button>
            </div>

            <div aria-live="polite" className="max-h-[65vh] overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                <div>
                  <p className="text-sm text-[var(--fg-muted)]">{t("appShell.globalSearch.prompt")}</p>
                  {recentSearches.length > 0 && (
                    <section className="mt-6" aria-label={t("appShell.globalSearch.recent")}>
                      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                        {t("appShell.globalSearch.recent")}
                      </h2>
                      <ul className="space-y-1">
                        {recentSearches.map((recent) => (
                          <li key={recent}>
                            <button
                              type="button"
                              onClick={() => setQuery(recent)}
                              className="w-full rounded-lg px-3 py-2 text-start text-sm text-[var(--fg)] hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
                            >
                              {recent}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              ) : isLoading ? (
                <p role="status" className="py-8 text-center text-sm text-[var(--fg-muted)]">{t("appShell.globalSearch.loading")}</p>
              ) : error ? (
                <p role="alert" className="py-8 text-center text-sm text-red-600 dark:text-red-400">{error}</p>
              ) : groupedResults.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--fg-muted)]">{t("appShell.globalSearch.empty")}</p>
              ) : (
                <div className="space-y-5">
                  {usedEnglishFallback && (
                    <p className="rounded-lg bg-[var(--bg-subtle)] px-3 py-2 text-xs leading-5 text-[var(--fg-muted)]">
                      {t("appShell.globalSearch.englishFallback")}
                    </p>
                  )}
                  {groupedResults.map((group) => (
                    <section key={group.type}>
                      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
                        {t(`appShell.globalSearch.types.${group.type}`)}
                      </h2>
                      <ul className="space-y-1">
                        {group.results.map((result) => (
                          <li key={`${result.type}-${result.id}`}>
                            <Link
                              href={result.href}
                              onClick={rememberSearch}
                              className="block rounded-xl px-3 py-3 transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
                            >
                              <span className="block text-sm font-semibold text-[var(--fg)]">{result.title}</span>
                              {result.context && <span className="mt-0.5 block text-xs text-[#7D288F] dark:text-purple-300">{result.context}</span>}
                              {result.description && <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[var(--fg-muted)]">{result.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
