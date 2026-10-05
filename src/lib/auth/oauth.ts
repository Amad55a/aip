import { createClient } from "@/lib/supabase/client";

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = createClient();
  const origin = window.location.origin;

  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
}
