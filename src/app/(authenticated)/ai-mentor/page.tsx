"use client";

import { useLanguage } from "@/hooks/useLanguage";
import AIMentorChat from "@/components/learn/AIMentorChat";

export default function AIMentorPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8 pb-24 sm:px-8 sm:py-10 md:pb-10">
      <div className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--fg-muted)]">
          {t("appShell.nav.aiMentor")}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--fg)]">
          {t("appShell.explore.aiMentor.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">
          {t("appShell.explore.aiMentor.description")}
        </p>
      </div>
      <AIMentorChat />
    </div>
  );
}
