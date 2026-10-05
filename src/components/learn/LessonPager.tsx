"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";

export default function LessonPager({
  courseSlug,
  previous,
  next,
  completed,
}: {
  courseSlug: string;
  previous: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
  completed: boolean;
}) {
  const { t } = useLanguage();
  const courseHref = `/learn/${courseSlug}`;

  return (
    <footer className="sticky bottom-14 z-20 border-t border-[var(--border)] bg-[var(--bg)]/95 px-3 py-3 backdrop-blur md:bottom-0 sm:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 sm:gap-4">
        {previous ? (
          <PagerLink href={previous.href} label={t("appShell.lessonContent.previous")} title={`← ${previous.title}`} />
        ) : (
          <PagerLink href={courseHref} label={t("appShell.lessonContent.returnTo")} title={t("appShell.lessonContent.roadmap")} />
        )}
        {next ? (
          <PagerLink href={next.href} label={t("appShell.lessonContent.next")} title={`${next.title} →`} align="end" />
        ) : (
          <PagerLink
            href={completed ? courseHref : "#lesson-complete"}
            label={t("appShell.lessonContent.courseComplete")}
            title={`${t("appShell.lessonContent.backToRoadmap")} →`}
            align="end"
            accent
          />
        )}
      </div>
    </footer>
  );
}

function PagerLink({
  href,
  label,
  title,
  align = "start",
  accent = false,
}: {
  href: string;
  label: string;
  title: string;
  align?: "start" | "end";
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`min-w-0 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] ${
        align === "end" ? "text-end" : "text-start"
      } ${accent ? "text-[#7D288F] dark:text-purple-300" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}
    >
      <span className="block text-[10px] font-medium uppercase tracking-wide text-[var(--fg-muted)]">
        {label}
      </span>
      <span className="block truncate">{title}</span>
    </Link>
  );
}
