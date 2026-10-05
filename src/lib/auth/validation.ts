const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
};

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

export function isStrongPassword(password: string) {
  const normalized = password.trim();
  return (
    normalized.length >= 8 && /[A-Za-z]/.test(normalized) && /\d/.test(normalized)
  );
}

export function validateSignIn(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const email = input.email.trim();
  const password = input.password.trim();

  if (!email) {
    errors.email = "auth.errors.emailRequired";
  } else if (!isValidEmail(email)) {
    errors.email = "auth.errors.emailInvalid";
  }

  if (!password) {
    errors.password = "auth.errors.passwordRequired";
  }

  return errors;
}

export function validateSignUp(input: {
  fullName: string;
  email: string;
  password: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.fullName.trim();
  const email = input.email.trim();
  const password = input.password.trim();

  if (!name) {
    errors.fullName = "auth.errors.fullNameRequired";
  } else if (name.length < 2) {
    errors.fullName = "auth.errors.fullNameMin";
  }

  if (!email) {
    errors.email = "auth.errors.emailRequired";
  } else if (!isValidEmail(email)) {
    errors.email = "auth.errors.emailInvalid";
  }

  if (!password) {
    errors.password = "auth.errors.passwordRequired";
  } else if (!isStrongPassword(password)) {
    errors.password = "auth.errors.passwordWeak";
  }

  return errors;
}
