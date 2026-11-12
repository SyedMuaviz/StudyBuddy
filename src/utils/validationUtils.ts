/**
 * validationUtils.ts
 * Input validation helpers shared across auth and task forms.
 * Centralising validation prevents duplicate logic in each form.
 */

/** Returns an error string or null if the email is valid. */
export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required';
  // RFC-5321 simplified regex — good enough for form validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address';
  return null;
}

/** Returns an error string or null if the password meets requirements. */
export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

/** Capitalises the first letter of each word — used for subject tags. */
export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Trims and collapses internal whitespace. */
export function sanitize(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}
