"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ContentLanguageFallbackNotice from "@/components/app/ContentLanguageFallbackNotice";
import { useLanguage } from "@/hooks/useLanguage";
import {
  getLocalizedProject,
  PROJECTS,
  type Project,
  type ProjectCategory,
} from "@/lib/projects";

type ProjectBrowserProps = {
  initialCompletedIds: Set<string>;
};

const CATEGORY_OPTIONS = [
  { value: "all", labelKey: "appShell.projectLibrary.categories.all" },
  { value: "html-css-js", labelKey: "appShell.projectLibrary.categories.html" },
  { value: "mern", labelKey: "appShell.projectLibrary.categories.mern" },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: "all", labelKey: "appShell.projectLibrary.difficulty.all" },
  { value: "beginner", labelKey: "appShell.projectLibrary.difficulty.beginner" },
  { value: "intermediate", labelKey: "appShell.projectLibrary.difficulty.intermediate" },
  { value: "advanced", labelKey: "appShell.projectLibrary.difficulty.advanced" },
] as const;

export default function ProjectBrowser({ initialCompletedIds }: ProjectBrowserProps) {
  const { language, t } = useLanguage();
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const [difficulty, setDifficulty] = useState<"all" | Project["difficulty"]>("all");
  const [search, setSearch] = useState("");
  const [completedIds] = useState<Set<string>>(initialCompletedIds);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    const localizedProjects = PROJECTS.map((project) =>
      getLocalizedProject(project, language)
    );

    return [
      {
        key: "html-css-js",
        label: t("appShell.projectLibrary.categories.html"),
        projects: localizedProjects.filter(
          (project) =>
            project.category === "html-css-js" &&
            (category === "all" || category === project.category) &&
            (difficulty === "all" || difficulty === project.difficulty) &&
            (!query ||
              `${project.title} ${project.description} ${project.technologies.join(" ")}`
                .toLowerCase()
                .includes(query))
        ),
      },
      {
        key: "mern",
        label: t("appShell.projectLibrary.categories.mern"),
        projects: localizedProjects.filter(
          (project) =>
            project.category === "mern" &&
            (category === "all" || category === project.category) &&
            (difficulty === "all" || difficulty === project.difficulty) &&
            (!query ||
              `${project.title} ${project.description} ${project.technologies.join(" ")}`
                .toLowerCase()
                .includes(query))
        ),
      },
    ].filter((group) => group.projects.length > 0);
  }, [category, difficulty, language, search, t]);

  const completedTotal = PROJECTS.filter((project) => completedIds.has(project.id)).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <ContentLanguageFallbackNotice contentType="project" />
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-[var(--fg-muted)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6" />
              <path d="M16 16l5 5" />
            </svg>
          </span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("appShell.projectLibrary.searchPlaceholder")}
            aria-label={t("appShell.projectLibrary.searchPlaceholder")}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] py-3 ps-12 pe-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none transition focus:border-[#7D288F] focus:ring-2 focus:ring-[#7D288F]/20"
          />
        </div>

        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("appShell.projectLibrary.categoriesLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value as "all" | ProjectCategory)}
                  className={[
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
                    category === item.value
                      ? "border-[#7D288F] bg-[#7D288F] text-white"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] hover:border-[#7D288F]/50 hover:text-[#7D288F]",
                  ].join(" ")}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("appShell.projectLibrary.difficultyLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setDifficulty(item.value as "all" | Project["difficulty"])}
                  className={[
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
                    difficulty === item.value
                      ? "border-[#7D288F] bg-[#F6E9FF] text-[#7D288F] dark:bg-[#2B1F3A] dark:text-purple-200"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--fg-muted)] hover:border-[#7D288F]/50 hover:text-[#7D288F]",
                  ].join(" ")}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--fg-muted)]">
        <span className="font-semibold text-[var(--fg)]">{t("appShell.projectLibrary.myProjects")}</span>
        <div className="mt-2">{t("appShell.projectLibrary.completed")}: {completedTotal} / {PROJECTS.length}</div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center text-[var(--fg-muted)]">
          {t("appShell.projectLibrary.noMatch")}
        </div>
      ) : (
        filteredCategories.map((group) => (
          <section key={group.key} className="space-y-5">
            <div className="flex items-end justify-between gap-4 border-b border-[var(--border)] pb-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7D288F] dark:text-purple-300">
                  {group.label}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--fg)]">{group.projects.length} {t("appShell.projectLibrary.projects")}</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.projects.map((project) => {
                const completed = completedIds.has(project.id);

                return (
                  <article
                    key={project.id}
                    className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#7D288F]/40 hover:shadow-md"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7D288F] dark:text-purple-300">
                          {t(`appShell.projectLibrary.difficulty.${project.difficulty}`)}
                        </span>
                        {completed && (
                          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold leading-none text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="m5 10 3.2 3.2L15 6.5" />
                            </svg>
                            {t("appShell.projectLibrary.completed")}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 break-words text-xl font-bold leading-snug text-[var(--fg)]">{project.title}</h3>
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-6 text-[var(--fg-muted)]">{project.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span key={`${project.id}-${technology}`} className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--fg-muted)]">
                          {technology}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#7D288F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#681f78]"
                    >
                      {t("appShell.projectLibrary.viewProject")}
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
