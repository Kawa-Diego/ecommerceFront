export function normalizeCpf(cpf) {
  return cpf.replace(/\D/g, "");
}

export function formatCpf(value) {
  const digits = normalizeCpf(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function isValidCpf(cpf) {
  const digits = normalizeCpf(cpf);

  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) {
    return false;
  }

  const calculateDigit = (base, factorStart) => {
    let total = 0;

    for (let index = 0; index < base.length; index += 1) {
      total += Number(base[index]) * (factorStart - index);
    }

    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(digits.slice(0, 9), 10);
  const secondDigit = calculateDigit(digits.slice(0, 10), 11);

  return firstDigit === Number(digits[9]) && secondDigit === Number(digits[10]);
}
