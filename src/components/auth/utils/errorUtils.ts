
import { toast } from '@/components/ui/use-toast';
import { AuthError } from '@supabase/supabase-js';

export interface AuthErrorInfo {
  title: string;
  description: string;
  isRetryable: boolean;
}

export const getAuthErrorInfo = (error: AuthError | Error): AuthErrorInfo => {
  const message = error.message.toLowerCase();

  // OTP/Email link expired or invalid
  if (message.includes('otp_expired') || message.includes('email link is invalid') || message.includes('has expired')) {
    return {
      title: "Verification Link Expired",
      description: "Your verification link has expired. Please request a new one to continue.",
      isRetryable: true
    };
  }

  // Network and connection errors
  if (message.includes('network') || message.includes('fetch')) {
    return {
      title: "Connection Error",
      description: "Unable to connect to server. Please check your internet connection and try again.",
      isRetryable: true
    };
  }

  // Rate limiting
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return {
      title: "Too Many Attempts",
      description: "Too many requests. Please wait a few minutes before trying again.",
      isRetryable: true
    };
  }

  // Invalid credentials
  if (message.includes('invalid login credentials') || message.includes('email not confirmed')) {
    return {
      title: "Sign In Failed",
      description: "Invalid phone number or password. Please check your credentials and try again.",
      isRetryable: true
    };
  }

  // User already exists
  if (message.includes('user already registered') || message.includes('already been registered')) {
    return {
      title: "Account Already Exists",
      description: "An account with this phone number already exists. Try signing in instead.",
      isRetryable: false
    };
  }

  // Invalid email format (our custom emails)
  if (message.includes('email address') && message.includes('invalid')) {
    return {
      title: "Registration Error",
      description: "Unable to create account with this phone number. Please contact support if this continues.",
      isRetryable: false
    };
  }

  // Weak password
  if (message.includes('password') && (message.includes('weak') || message.includes('strength'))) {
    return {
      title: "Weak Password",
      description: "Please choose a stronger password with at least 6 characters.",
      isRetryable: true
    };
  }

  // Email confirmation required
  if (message.includes('email not confirmed') || message.includes('confirmation')) {
    return {
      title: "Email Confirmation Required",
      description: "Please check your email and click the confirmation link before signing in.",
      isRetryable: false
    };
  }

  // Session expired
  if (message.includes('refresh_token_not_found') || message.includes('session')) {
    return {
      title: "Session Expired",
      description: "Your session has expired. Please sign in again.",
      isRetryable: true
    };
  }

  // Generic server error
  if (message.includes('internal server error') || message.includes('500')) {
    return {
      title: "Server Error",
      description: "Something went wrong on our end. Please try again in a few minutes.",
      isRetryable: true
    };
  }

  // Default case
  return {
    title: "Authentication Error",
    description: error.message || "An unexpected error occurred. Please try again.",
    isRetryable: true
  };
};

export const handleAuthError = (error: AuthError | Error, context?: string): void => {
  console.error(`Auth error${context ? ` (${context})` : ''}:`, error);
  
  const errorInfo = getAuthErrorInfo(error);
  
  toast({
    title: errorInfo.title,
    description: errorInfo.description,
    variant: "destructive"
  });
};

export const handleNetworkError = (error: Error, operation: string): void => {
  console.error(`Network error during ${operation}:`, error);
  
  toast({
    title: "Connection Problem",
    description: `Unable to ${operation}. Please check your internet connection and try again.`,
    variant: "destructive"
  });
};

export const handleUnexpectedError = (error: Error, operation: string): void => {
  console.error(`Unexpected error during ${operation}:`, error);
  
  toast({
    title: "Unexpected Error",
    description: `Something went wrong while trying to ${operation}. Please try again.`,
    variant: "destructive"
  });
};

export const handleUrlError = (params: URLSearchParams): boolean => {
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  const errorCode = params.get('error_code');

  if (error) {
    console.error('URL Auth Error:', { error, errorCode, errorDescription });

    if (error === 'access_denied' && errorCode === 'otp_expired') {
      toast({
        title: "Verification Link Expired",
        description: "Your verification link has expired. Please try signing up again or request a new verification email.",
        variant: "destructive"
      });
      return true;
    }

    // Handle other URL errors
    toast({
      title: "Authentication Error",
      description: errorDescription || "An error occurred during authentication. Please try again.",
      variant: "destructive"
    });
    return true;
  }

  return false;
};
