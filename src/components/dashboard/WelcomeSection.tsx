"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

function getFirstName(profile: { full_name: string | null } | null, email?: string | null): string {
  if (profile?.full_name?.trim()) {
    return profile.full_name.trim().split(" ")[0];
  }
  if (email) return email.split("@")[0];
  return "";
}

export default function WelcomeSection() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const firstName = getFirstName(profile, user?.email);

  return (
    <div className="space-y-1">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--fg)]">
        {t("appShell.welcome.greeting")}
        {firstName && (
          <span className="text-[#7D288F] dark:text-purple-400">, {firstName}</span>
        )}{" "}
        👋
      </h1>
      <p className="text-sm text-[var(--fg-muted)]">{t("appShell.welcome.subline")}</p>
    </div>
  );
}
