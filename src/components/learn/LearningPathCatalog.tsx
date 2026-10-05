"use client";

import Link from "next/link";
import type { LearningPath } from "@/lib/supabase/database.types";
import { useLanguage } from "@/hooks/useLanguage";

type CatalogPath = Pick<
  LearningPath,
  "id" | "title" | "slug" | "description" | "short_description" | "difficulty" | "estimated_hours"
> & { courseCount: number };

export default function LearningPathCatalog({ paths }: { paths: CatalogPath[] }) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-28 sm:px-8 sm:py-10 md:pb-12">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {t("common.learningPaths")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)] sm:text-4xl">
          {t("appShell.learn.catalogTitle")}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--fg-muted)]">
          {t("appShell.learn.catalogDescription")}
        </p>
      </header>

      {paths.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paths.map((path) => (
            <article
              key={path.id}
              className="flex min-w-0 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold text-[#7D288F] dark:text-purple-300">
                  {path.difficulty}
                </span>
                <span className="text-xs text-[var(--fg-muted)]">
                  {path.estimated_hours} {t("appShell.learn.hours")}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[var(--fg)]">{path.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-[var(--fg-muted)]">
                {path.short_description ?? path.description}
              </p>
              <p className="mt-5 text-xs font-semibold text-[var(--fg-muted)]">
                {t("appShell.learn.courseCount").replace("{count}", String(path.courseCount))}
              </p>
              <Link
                href={`/learn/paths/${path.slug}`}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#7D288F] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#681f78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]"
              >
                {t("appShell.learn.openPath")}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--fg-muted)]">
          {t("appShell.learn.noPaths")}
        </p>
      )}
    </div>
  );
}
