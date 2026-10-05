import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { canonicalProductionHost } from "@/lib/auth/routes";

/**
 * Next.js 16 renamed middleware.ts → proxy.ts.
 * This keeps the recommended Supabase session refresh on every matched request.
 */
export async function proxy(request: NextRequest) {
  const canonicalHost = canonicalProductionHost(request.nextUrl.hostname);
  if (canonicalHost) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.host = canonicalHost;
    canonicalUrl.protocol = "https:";
    return NextResponse.redirect(canonicalUrl, 308);
  }
  if (/\.[^/]+$/.test(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
  ],
};
