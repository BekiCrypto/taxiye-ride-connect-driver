
import { toast } from '@/components/ui/use-toast';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateAuthInput = (
  phone: string, 
  password: string, 
  name?: string, 
  email?: string,
  mode?: 'signin' | 'signup'
): ValidationResult => {
  // Check required fields
  if (!phone?.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (!password?.trim()) {
    return { isValid: false, error: "Password is required" };
  }

  // Phone validation with improved checks
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) {
    return phoneValidation;
  }

  // Password strength validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // Name validation for signup
  if (mode === 'signup' && !name?.trim()) {
    return { isValid: false, error: "Full name is required for registration" };
  }

  if (mode === 'signup' && name && name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  // Email validation if provided
  if (email && !validateEmailFormat(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone?.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }

  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return { isValid: false, error: "Phone number must be at least 10 digits" };
  }

  if (cleanPhone.length > 15) {
    return { isValid: false, error: "Phone number cannot exceed 15 digits" };
  }

  // Check for valid phone number patterns
  if (!/^[0-9+\-\s()]+$/.test(phone)) {
    return { isValid: false, error: "Phone number contains invalid characters" };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters long" };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password cannot exceed 128 characters" };
  }

  // Check for at least one letter or number
  if (!/[a-zA-Z0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one letter or number" };
  }

  return { isValid: true };
};

export const validateEmailFormat = (email: string): boolean => {
  if (!email) return true; // Email is optional in many cases
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateOTP = (otp: string, generatedOtp: string): ValidationResult => {
  if (!otp?.trim()) {
    return { isValid: false, error: "Please enter the verification code" };
  }

  if (otp.length !== 4) {
    return { isValid: false, error: "Verification code must be 4 digits" };
  }

  if (!/^\d{4}$/.test(otp)) {
    return { isValid: false, error: "Verification code must contain only numbers" };
  }

  if (!generatedOtp) {
    return { isValid: false, error: "No verification code was generated. Please request a new code." };
  }

  if (otp !== generatedOtp) {
    return { isValid: false, error: "Invalid verification code. Please check and try again." };
  }

  return { isValid: true };
};

export const showValidationError = (error: string) => {
  toast({
    title: "Validation Error",
    description: error,
    variant: "destructive"
  });
};
