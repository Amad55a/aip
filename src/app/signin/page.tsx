"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import AuthPageControls from "@/components/auth/AuthPageControls";
import { EyeIcon, GitHubLogo, GoogleLogo } from "@/components/auth/SocialLogos";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { getAuthErrorKey } from "@/lib/auth/errors";
import { signInWithOAuth } from "@/lib/auth/oauth";
import { validateSignIn } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";

type Pending = "email" | "google" | "github" | null;

function SignInForm() {
  const { t, strings } = useLanguage();
  const { user, loading, configured } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (!loading && user) {
      const next = searchParams.get("next");
      const destination =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      router.replace(destination);
    }
  }, [loading, user, router, searchParams]);

  const quotes = strings.auth?.signInQuotes || [];
  const oauthError = searchParams.get("error");
  const busy = pending !== null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();
    const errors = validateSignIn({ email: normalizedEmail, password: normalizedPassword });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!configured) {
      setFormError("auth.errors.notConfigured");
      return;
    }

    setPending("email");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedPassword,
      });
      if (error) {
        setFormError(getAuthErrorKey(error));
        return;
      }
      const next = searchParams.get("next");
      const destination =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      router.push(destination);
    } catch (error) {
      setFormError(getAuthErrorKey(error));
    } finally {
      setPending(null);
    }
  }

  async function onOAuth(provider: "google" | "github") {
    setFormError(null);
    if (!configured) {
      setFormError("auth.errors.notConfigured");
      return;
    }
    setPending(provider);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setFormError(getAuthErrorKey(error));
        setPending(null);
      }
    } catch (error) {
      setFormError(getAuthErrorKey(error));
      setPending(null);
    }
  }

  const bannerKey =
    formError ||
    (oauthError === "oauth"
      ? "auth.errors.oauthFailed"
      : oauthError === "confirm"
        ? "auth.errors.confirmFailed"
        : null);

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 dark:bg-[#0A090E] dark:text-neutral-100 transition-colors flex flex-col">
      <AuthPageControls />

      <div className="flex-1 lg:grid lg:grid-cols-2">
        <section className="flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-[#0A090E] order-2 lg:order-1">
          <div className="w-full max-w-md space-y-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-neutral-900 dark:text-white mb-6 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7D288F] text-white shadow-sm transition-transform group-hover:scale-105">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <span>TechPath AI</span>
              </Link>

              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {t("auth.signIn.title")}
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {t("auth.signIn.description")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  {t("auth.signIn.email")}
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@example.com"
                  className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-[#7D288F] focus:bg-white focus:ring-2 focus:ring-[#7D288F]/20 dark:border-neutral-700 dark:bg-[#14121C] dark:text-white dark:placeholder-neutral-500 dark:focus:border-purple-500"
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{t(fieldErrors.email)}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    {t("auth.signIn.password")}
                  </label>
                  <span className="text-xs font-semibold text-[#7D288F] dark:text-purple-400">
                    {t("auth.signIn.forgotPassword")}
                  </span>
                </div>
                <div className="relative mt-1.5 flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 ltr:pr-10 rtl:pl-10 px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition focus:border-[#7D288F] focus:bg-white focus:ring-2 focus:ring-[#7D288F]/20 dark:border-neutral-700 dark:bg-[#14121C] dark:text-white dark:placeholder-neutral-500 dark:focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute ltr:right-3 rtl:left-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{t(fieldErrors.password)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-[#7D288F] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#681f78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D288F] transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {pending === "email" ? t("auth.loading.signingIn") : t("auth.signIn.submit")}
              </button>

              {bannerKey && (
                <p role="alert" className="text-center text-xs font-medium text-red-600 dark:text-red-400">
                  {t(bannerKey)}
                </p>
              )}
            </form>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
              <span className="absolute bg-white dark:bg-[#0A090E] px-3 text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                {t("auth.signIn.continueWith")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void onOAuth("google")}
                className="flex items-center justify-center gap-2.5 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-[#14121C] dark:text-neutral-200 dark:hover:bg-neutral-800 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <GoogleLogo />
                <span>{pending === "google" ? t("auth.loading.connecting") : t("auth.signIn.google")}</span>
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void onOAuth("github")}
                className="flex items-center justify-center gap-2.5 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-[#14121C] dark:text-neutral-200 dark:hover:bg-neutral-800 transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <GitHubLogo />
                <span>{pending === "github" ? t("auth.loading.connecting") : t("auth.signIn.github")}</span>
              </button>
            </div>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              {t("auth.signIn.noAccount")}{" "}
              <Link
                href="/signup"
                className="font-bold text-[#7D288F] dark:text-purple-400 hover:underline transition-colors"
              >
                {t("auth.signIn.createAccount")}
              </Link>
            </p>
          </div>
        </section>

        <section className="relative flex flex-col justify-between border-t lg:border-t-0 ltr:lg:border-l rtl:lg:border-r border-neutral-200 dark:border-neutral-800 bg-[#FAF8FC] dark:bg-[#0E0B14] p-8 lg:p-16 transition-colors order-1 lg:order-2">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7D288F] dark:text-purple-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7D288F] dark:bg-purple-400" />
              {t("auth.signInSection.label")}
            </span>
            <h1 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.15]">
              “{t("auth.signInSection.title")}”
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-xl">
              {t("auth.signInSection.description")}
            </p>
          </div>

          <div className="mt-12 lg:mt-16 space-y-6">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {t("auth.signInSection.quotesHeader")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {quotes.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200/80 bg-white/70 dark:border-neutral-800 dark:bg-[#14101F]/70 p-4 transition-colors"
                >
                  <p className="text-xs sm:text-sm font-medium italic text-neutral-800 dark:text-neutral-200">
                    “{q.quote}”
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[#7D288F] dark:text-purple-300">
                    — {q.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
