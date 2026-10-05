"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

/* ─── Helpers ────────────────────────────────────────────────────── */
function getDisplayName(profile: { full_name: string | null } | null, email?: string | null): string {
  if (profile?.full_name?.trim()) return profile.full_name.trim();
  if (email) return email.split("@")[0];
  return "User";
}

function getInitial(displayName: string): string {
  return displayName.charAt(0).toUpperCase();
}

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({
  avatarUrl,
  initial,
  size = "sm",
}: {
  avatarUrl: string | null;
  initial: string;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? "h-10 w-10 text-base" : "h-8 w-8 text-sm";
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className={`${dim} rounded-full object-cover border border-[var(--border)]`}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${dim} inline-flex items-center justify-center rounded-full bg-[#7D288F]/10 font-bold text-[#7D288F] dark:bg-purple-950/60 dark:text-purple-300 border border-[var(--brand-border)]`}
    >
      {initial}
    </span>
  );
}

/* ─── Component ──────────────────────────────────────────────────── */
export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayName = getDisplayName(profile, user?.email);
  const initial = getInitial(displayName);
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    setOpen(false);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("appShell.profile")}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-[var(--bg-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F]"
      >
        <Avatar avatarUrl={avatarUrl} initial={initial} size="sm" />
        <span className="hidden sm:block max-w-[7rem] truncate text-sm font-medium text-[var(--fg)]">
          {displayName}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 text-[var(--fg-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="
            absolute end-0 top-full z-50 mt-2
            w-56 overflow-hidden rounded-xl
            border border-[var(--border)]
            bg-[var(--bg)]
            shadow-lg shadow-black/8 dark:shadow-black/30
          "
        >
          {/* User info header */}
          <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
            <Avatar avatarUrl={avatarUrl} initial={initial} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--fg)]">{displayName}</p>
              <p className="truncate text-xs text-[var(--fg-muted)]">{user?.email}</p>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {t("appShell.userMenu.profile")}
            </Link>
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              {t("appShell.userMenu.dashboard")}
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border)] py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {signingOut ? `${t("appShell.userMenu.signOut")}…` : t("appShell.userMenu.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
