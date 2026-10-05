"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import type { WebSearchResponse, WebSearchResult } from "@/lib/web-search/types";

function isWebSearchResult(value: unknown): value is WebSearchResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.title === "string" &&
    typeof result.url === "string" &&
    typeof result.displayUrl === "string" &&
    (result.snippet === undefined || typeof result.snippet === "string")
  );
}

function isWebSearchResponse(value: unknown): value is WebSearchResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as Record<string, unknown>;
  return (
    Array.isArray(response.results) &&
    response.results.every(isWebSearchResult) &&
    typeof response.page === "number" &&
    typeof response.hasNextPage === "boolean" &&
    (response.totalResults === undefined || typeof response.totalResults === "number")
  );
}

const ERROR_TRANSLATIONS: Record<string, string> = {
  invalid_query: "appShell.webSearch.enterQuery",
  invalid_page: "appShell.webSearch.somethingWrong",
  search_busy: "appShell.webSearch.searchBusy",
  search_timeout: "appShell.webSearch.searchTimeout",
  search_unavailable: "appShell.webSearch.searchUnavailable",
  unauthorized: "appShell.webSearch.searchUnavailable",
};

function getErrorTranslation(code: string | undefined) {
  return (code && ERROR_TRANSLATIONS[code]) || "appShell.webSearch.somethingWrong";
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg
      aria-hidden="true"
      className="shrink-0 rtl:rotate-180"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "previous" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

function LoadingResults({ label }: { label: string }) {
  return (
    <div role="status" aria-label={label} aria-live="polite" className="mt-8 space-y-4">
      <p className="text-sm font-medium text-[var(--fg-muted)]">{label}</p>
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          aria-hidden="true"
          className="animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
        >
          <div className="h-4 w-2/5 rounded bg-[var(--bg-subtle)]" />
          <div className="mt-3 h-3 w-1/4 rounded bg-[var(--bg-subtle)]" />
          <div className="mt-5 h-3 w-full rounded bg-[var(--bg-subtle)]" />
          <div className="mt-2 h-3 w-4/5 rounded bg-[var(--bg-subtle)]" />
        </div>
      ))}
    </div>
  );
}

export default function WebSearch({
  initialQuery,
  initialPage,
}: {
  initialQuery: string;
  initialPage: string;
}) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!initialQuery.trim()) {
      setResults([]);
      setPage(1);
      setHasNextPage(false);
      setErrorKey("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    let timedOut = false;
    let disposed = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15_000);
    setIsLoading(true);
    setErrorKey("");

    fetch(
      `/api/web-search?q=${encodeURIComponent(initialQuery)}&page=${encodeURIComponent(initialPage || "1")}`,
      { signal: controller.signal }
    )
      .then(async (response) => {
        const payload: unknown = await response.json();
        if (!response.ok) {
          const code =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
              ? payload.error
              : undefined;
          throw new Error(code ?? "search_unavailable");
        }
        if (!isWebSearchResponse(payload)) {
          throw new Error("invalid_response");
        }
        setResults(payload.results);
        setPage(payload.page);
        setHasNextPage(payload.hasNextPage);
      })
      .catch((searchError: unknown) => {
        if (disposed) return;
        if (timedOut) {
          setErrorKey("appShell.webSearch.searchTimeout");
        } else {
          setErrorKey(
            getErrorTranslation(searchError instanceof Error ? searchError.message : undefined)
          );
        }
        setResults([]);
        setHasNextPage(false);
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!disposed) setIsLoading(false);
      });

    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [initialPage, initialQuery, retryCount]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorKey("appShell.webSearch.enterQuery");
      return;
    }
    if (trimmed === initialQuery && initialPage === "1") {
      setRetryCount((count) => count + 1);
      return;
    }

    const params = new URLSearchParams({ q: trimmed });
    router.push(`/web-search?${params.toString()}`);
  }

  function navigateToPage(nextPage: number) {
    if (isLoading || !initialQuery.trim()) return;
    const params = new URLSearchParams({ q: initialQuery, page: String(nextPage) });
    router.push(`/web-search?${params.toString()}`);
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
    >
      <header className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#7D288F] dark:text-purple-300">
          {t("appShell.webSearch.title")}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--fg)] sm:text-4xl">
          {t("appShell.webSearch.description")}
        </h1>

        <form
          role="search"
          onSubmit={submitSearch}
          className="mt-7 flex min-h-14 w-full items-stretch gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm focus-within:border-[#7D288F] focus-within:ring-2 focus-within:ring-[#7D288F]/15"
        >
          <label className="sr-only" htmlFor="web-search-query">
            {t("appShell.webSearch.title")}
          </label>
          <input
            id="web-search-query"
            type="search"
            value={query}
            maxLength={200}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("appShell.webSearch.placeholder")}
            dir={isRTL ? "rtl" : "auto"}
            className="min-w-0 flex-1 rounded-xl bg-transparent px-3 text-base text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7D288F] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#681f78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] disabled:cursor-wait disabled:opacity-70"
          >
            <SearchIcon className="h-4 w-4" />
            <span>{t("appShell.webSearch.search")}</span>
          </button>
        </form>
      </header>

      {!initialQuery.trim() ? (
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[#7D288F] dark:text-purple-300">
            <SearchIcon />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[var(--fg)]">
            {t("appShell.webSearch.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--fg-muted)]">
            {t("appShell.webSearch.noQuery")}
          </p>
        </div>
      ) : isLoading ? (
        <div className="mx-auto max-w-3xl">
          <LoadingResults label={t("appShell.webSearch.searching")} />
        </div>
      ) : errorKey ? (
        <div
          role="alert"
          className="mx-auto mt-8 flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[var(--fg)]">{t(errorKey)}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
          >
            {t("appShell.webSearch.tryAgain")}
          </button>
        </div>
      ) : (
        <section aria-labelledby="web-search-results-heading" className="mx-auto mt-9 max-w-3xl">
          <h2
            id="web-search-results-heading"
            className="mb-4 text-lg font-semibold text-[var(--fg)]"
          >
            {t("appShell.webSearch.searchResults")} <span dir="auto">“{initialQuery}”</span>
          </h2>

          {results.length === 0 ? (
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--fg-muted)]">
              {t("appShell.webSearch.noResults")}
            </p>
          ) : (
            <div className="space-y-4" aria-label={t("appShell.webSearch.webResults")}>
              {results.map((result) => (
                <article
                  key={result.url}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--brand-border)] sm:p-6"
                >
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${result.title} — ${t("appShell.webSearch.openResult")}`}
                    className="group inline-block rounded-sm text-lg font-semibold leading-snug text-[#70217f] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] dark:text-purple-300 sm:text-xl"
                    dir="auto"
                  >
                    {result.title}
                  </a>
                  <p
                    aria-label={t("appShell.webSearch.resultDomain")}
                    dir="ltr"
                    className="mt-2 break-all text-xs font-medium text-[var(--fg-muted)]"
                  >
                    {result.displayUrl}
                  </p>
                  {result.snippet && (
                    <p dir="auto" className="mt-3 break-words text-sm leading-6 text-[var(--fg-muted)]">
                      {result.snippet}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          {(page > 1 || hasNextPage) && (
            <nav
              aria-label={t("appShell.webSearch.webResults")}
              className="mt-7 flex items-center justify-between gap-3"
            >
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => navigateToPage(page - 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-[#7D288F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowIcon direction="previous" />
                {t("appShell.webSearch.previous")}
              </button>
              <span className="text-sm text-[var(--fg-muted)]">
                {t("appShell.webSearch.page")} {page}
              </span>
              <button
                type="button"
                disabled={!hasNextPage || isLoading}
                onClick={() => navigateToPage(page + 1)}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-[#7D288F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("appShell.webSearch.next")}
                <ArrowIcon direction="next" />
              </button>
            </nav>
          )}
        </section>
      )}
    </section>
  );
}
