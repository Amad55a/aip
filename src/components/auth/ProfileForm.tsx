"use client";

import { useEffect, useState, type FormEvent } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/landing/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm() {
  const { user, profile, setProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
  }, [profile?.full_name]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length > 120) {
      setError(t("appShell.profilePage.nameValidation"));
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: trimmedName })
      .eq("id", user.id)
      .select("*")
      .single();

    if (updateError) {
      console.error("Profile update failed.", {
        userId: user.id,
        code: updateError.code,
        message: updateError.message,
      });
      setError(t("appShell.profilePage.saveError"));
      setSaving(false);
      return;
    }

    setProfile(data);
    setFullName(data.full_name ?? "");
    setMessage(t("appShell.profilePage.saved"));
    setSaving(false);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-28 sm:px-8 sm:py-10 md:pb-12">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          {t("appShell.profilePage.eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--fg)]">
          {t("appShell.profilePage.title")}
        </h1>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-4">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-16 w-16 rounded-full border border-[var(--border)] object-cover" />
          ) : (
            <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xl font-bold text-[#7D288F]">
              {(profile?.full_name?.trim() || user?.email || "U").charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[var(--fg)]">{profile?.full_name || user?.email}</h2>
            <p className="truncate text-sm text-[var(--fg-muted)]">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label htmlFor="profile-full-name" className="mb-1.5 block text-sm font-semibold text-[var(--fg)]">
              {t("appShell.profilePage.fullName")}
            </label>
            <input
              id="profile-full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              maxLength={120}
              autoComplete="name"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] focus-visible:outline-2 focus-visible:outline-[#7D288F]"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-[var(--fg)]">{t("appShell.profilePage.email")}</span>
            <p className="break-all rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-2.5 text-sm text-[var(--fg-muted)]">{user?.email ?? ""}</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#7D288F] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#681f78] disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? t("appShell.profilePage.saving") : t("appShell.profilePage.save")}
          </button>
          {message && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </form>
      </section>

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
        <h2 className="text-lg font-bold text-[var(--fg)]">{t("appShell.profilePage.preferences")}</h2>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <span className="text-sm font-semibold text-[var(--fg)]">{t("common.language")}</span>
          <LanguageSwitcher />
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-4">
          <span className="text-sm font-semibold text-[var(--fg)]">{t("common.theme")}</span>
          <ThemeToggle showLabel />
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-4 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
        >
          {t("appShell.userMenu.signOut")}
        </button>
      </section>
    </div>
  );
}
