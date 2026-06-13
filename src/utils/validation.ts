export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) return { isValid: false, message: 'Email is required.' };
  if (!/^\S+@\S+\.\S+$/.test(trimmed)) return { isValid: false, message: 'Enter a valid email address.' };
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { isValid: false, message: 'Password is required.' };
  if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters.' };
  return { isValid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name.trim()) return { isValid: false, message: 'Name is required.' };
  return { isValid: true };
}
