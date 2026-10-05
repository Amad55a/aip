import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import AppHeader from "@/components/app/AppHeader";
import AppSidebar from "@/components/app/AppSidebar";
import AppFooter from "@/components/app/AppFooter";
import MobileNav from "@/components/app/MobileNav";
import PageTransition from "@/components/app/PageTransition";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Auth guard ────────────────────────────────────────────────────
  if (!isSupabaseConfigured()) {
    redirect("/signin");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // ── Authenticated shell ───────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--fg)] transition-colors">
      <AppHeader />

      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <AppFooter />
      <MobileNav />
    </div>
  );
}
