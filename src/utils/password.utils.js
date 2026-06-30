const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function isStrongPassword(password) {
  return STRONG_PASSWORD_REGEX.test(password);
}

export function getPasswordRulesMessage() {
  return "A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.";
}
