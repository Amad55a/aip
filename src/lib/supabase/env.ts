/**
 * Public environment helpers for the browser-safe Supabase client.
 * Never put SUPABASE_SERVICE_ROLE_KEY here.
 */

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function isSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  return Boolean(
    url &&
      key &&
      !url.includes("your-supabase-project") &&
      !key.includes("your-supabase-anon-key")
  );
}
