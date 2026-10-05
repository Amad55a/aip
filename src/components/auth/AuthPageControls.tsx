"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/landing/ThemeToggle";

export default function AuthPageControls() {
  return (
    <div className="absolute top-5 ltr:right-6 rtl:left-6 z-30 flex items-center gap-3">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
