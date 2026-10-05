const PROTECTED_ROUTE_PREFIXES = ["/dashboard", "/profile", "/learn", "/projects", "/ai-mentor"];

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function isGuestOnlyRoute(pathname: string) {
  return pathname === "/" || pathname === "/signin" || pathname === "/signup";
}
