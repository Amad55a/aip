import { createClient } from "./client";
import { isSupabaseConfigured } from "./env";

/**
 * Dev-only helper to verify Supabase client initialization.
 * Returns status metadata without exposing secret keys.
 */
export function checkSupabaseClientStatus() {
  let initialized = false;
  try {
    const client = createClient();
    initialized = Boolean(client);
  } catch {
    initialized = false;
  }

  return {
    initialized,
    isUrlConfigured: isSupabaseConfigured(),
    isKeyConfigured: isSupabaseConfigured(),
    ready: initialized && isSupabaseConfigured(),
  };
}
