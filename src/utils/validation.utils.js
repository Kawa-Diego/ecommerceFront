export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
