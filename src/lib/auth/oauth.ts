import { createClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth/routes";

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = createClient();

  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: getAuthCallbackUrl(window.location.origin),
    },
  });
}
