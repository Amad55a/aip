const PROTECTED_ROUTE_PREFIXES = ["/dashboard", "/profile", "/learn", "/projects", "/ai-mentor"];

export function canonicalProductionHost(hostname: string) {
  return hostname.toLowerCase() === "www.techpathai.tech" ? "techpathai.tech" : null;
}

export function safeInternalPath(next: string | null, fallback = "/dashboard") {
  if (!next?.startsWith("/") || next.startsWith("//")) return fallback;
  const target = new URL(next, "https://internal.invalid");
  return target.origin === "https://internal.invalid"
    ? `${target.pathname}${target.search}${target.hash}`
    : fallback;
}

export function getAuthCallbackUrl(currentOrigin: string) {
  const origin = new URL(currentOrigin);
  if (origin.hostname === "www.techpathai.tech") {
    origin.hostname = "techpathai.tech";
  }
  return new URL("/auth/callback", origin).toString();
}

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isGuestOnlyRoute(pathname: string) {
  return pathname === "/" || pathname === "/signin" || pathname === "/signup";
}
