/**
 * Maps Supabase/Auth errors to translation keys.
 * Technical details stay in the console, never in the UI.
 */
export function getAuthErrorKey(error: unknown): string {
  if (!error) return "auth.errors.unknown";

  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "";

  const message = raw.toLowerCase();
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? Number((error as { status?: number }).status)
      : undefined;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code).toLowerCase()
      : "";

  if (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("fetch")
  ) {
    return "auth.errors.network";
  }

  if (
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already registered")
  ) {
    return "auth.errors.emailExists";
  }

  if (
    code === "weak_password" ||
    message.includes("password should be") ||
    message.includes("password is too weak") ||
    message.includes("weak password")
  ) {
    return "auth.errors.passwordTooWeak";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials") ||
    message.includes("email or password") ||
    status === 400 && message.includes("invalid")
  ) {
    return "auth.errors.invalidCredentials";
  }

  if (
    message.includes("unable to validate email") ||
    message.includes("invalid email") ||
    code === "email_address_invalid"
  ) {
    return "auth.errors.emailInvalid";
  }

  if (
    code.includes("oauth") ||
    message.includes("provider") ||
    message.includes("oauth")
  ) {
    return "auth.errors.oauthFailed";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("Auth error:", error);
  }

  return "auth.errors.unknown";
}
