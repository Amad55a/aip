"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function DashboardProjectsSummary({
  completedProjects,
  totalProjects,
}: {
  completedProjects: number;
  totalProjects: number;
}) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
      <div>
        <h2 className="text-lg font-bold text-[var(--fg)]">{t("appShell.dashboardProjects.title")}</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {t("appShell.dashboardProjects.completed")}{" "}
          <span className="font-semibold text-[var(--fg)]">{completedProjects} / {totalProjects}</span>
        </p>
      </div>
      <Link
        href="/projects"
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#7D288F]/30 px-4 py-2 text-sm font-semibold text-[#7D288F] transition-colors hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] sm:mt-0"
      >
        {t("appShell.dashboardProjects.view")}
      </Link>
    </section>
  );
}
