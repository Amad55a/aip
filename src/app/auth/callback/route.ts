import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { upsertOwnProfile } from "@/lib/auth/profile";
import { safeInternalPath } from "@/lib/auth/routes";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeInternalPath(searchParams.get("next"));

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("OAuth code exchange failed:", error.message);
      return NextResponse.redirect(`${origin}/signin?error=oauth`);
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      console.error("Email confirmation failed:", error.message);
      return NextResponse.redirect(`${origin}/signin?error=confirm`);
    }
  } else {
    return NextResponse.redirect(`${origin}/signin?error=oauth`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Auth callback completed without an authenticated user.", {
      error: userError?.message,
    });
    return NextResponse.redirect(`${origin}/signin?error=session`);
  }

  await upsertOwnProfile(supabase, user);
  return NextResponse.redirect(`${origin}${next}`);
}
