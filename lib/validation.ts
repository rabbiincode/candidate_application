export function isValidPhoneNumber(value: string): boolean {
  const phone = value.trim();
  const digitCount = phone.replace(/\D/g, "").length;

  return /^\+?[0-9\s()-]+$/.test(phone) && digitCount >= 7 && digitCount <= 15;
}
