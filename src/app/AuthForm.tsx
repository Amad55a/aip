"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const { t } = useLanguage();
  const signup = mode === "signup";
  const [sent, setSent] = useState(false);

  const input =
    "w-full rounded-lg border border-[#7b1fa2]/25 bg-white dark:bg-[#181622] dark:border-neutral-700 px-4 py-3 text-[15px] outline-none focus:border-[#7b1fa2] focus:ring-2 focus:ring-[#7b1fa2]/20 dark:text-white";

  return (
    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121018] p-8 shadow-xl ring-1 ring-[#7b1fa2]/10 dark:ring-neutral-800 sm:p-10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-xs font-semibold text-[#7b1fa2] hover:underline dark:text-purple-400">
          ← {t("common.home")}
        </Link>
        <LanguageSwitcher />
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-[#1d1533] dark:text-white">
        {signup ? t("auth.signUp.title") : t("auth.signIn.title")}
      </h1>
      <p className="mt-2 text-[#4a4160] dark:text-neutral-400">
        {signup ? t("auth.signUp.description") : t("auth.signIn.description")}
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        {signup && (
          <label className="block text-sm font-semibold text-[#1d1533] dark:text-neutral-200">
            {t("auth.signUp.fullName")}
            <input name="name" required autoComplete="name" className={`${input} mt-1.5 font-normal`} />
          </label>
        )}
        <label className="block text-sm font-semibold text-[#1d1533] dark:text-neutral-200">
          {signup ? t("auth.signUp.email") : t("auth.signIn.email")}
          <input name="email" type="email" required autoComplete="email" className={`${input} mt-1.5 font-normal`} />
        </label>
        <label className="block text-sm font-semibold text-[#1d1533] dark:text-neutral-200">
          {signup ? t("auth.signUp.password") : t("auth.signIn.password")}
          <input name="password" type="password" required minLength={8} autoComplete={signup ? "new-password" : "current-password"} className={`${input} mt-1.5 font-normal`} />
        </label>
        <button className="w-full rounded-lg bg-[#7b1fa2] py-3.5 text-[15px] font-semibold text-white hover:bg-[#6a1b92] transition-colors">
          {signup ? t("auth.signUp.submit") : t("auth.signIn.submit")}
        </button>
        {sent && <p role="status" className="text-sm text-[#6d17a3] dark:text-purple-300">{t("auth.formWorking")}</p>}
      </form>

      <p className="mt-6 text-center text-sm text-[#4a4160] dark:text-neutral-400">
        {signup ? t("auth.signUp.haveAccount") : t("auth.signIn.newHere")}{" "}
        <Link href={signup ? "/signin" : "/signup"} className="font-semibold text-[#7b1fa2] dark:text-purple-400 hover:underline">
          {signup ? t("auth.signUp.signInLink") : t("auth.signIn.signUp")}
        </Link>
      </p>
    </div>
  );
}