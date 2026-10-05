"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function ContentLanguageFallbackNotice({
  contentType,
  isTranslated = false,
}: {
  contentType: "learning" | "lesson" | "project";
  isTranslated?: boolean;
}) {
  const { language, t } = useLanguage();
  if (language === "en" || isTranslated) return null;

  return (
    <p className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm leading-6 text-[var(--fg-muted)]">
      {t(`appShell.translationFallback.${contentType}`)}
    </p>
  );
}
