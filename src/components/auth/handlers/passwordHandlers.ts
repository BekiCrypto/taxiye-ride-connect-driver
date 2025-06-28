
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { validateEmailFormat } from '../utils/validationUtils';
import { handleAuthError, handleNetworkError, handleUnexpectedError } from '../utils/errorUtils';

export const handleForgotPassword = async (
  resetEmail: string, 
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  console.log('Starting password reset for email:', resetEmail);

  // Validate email input
  if (!resetEmail?.trim()) {
    toast({
      title: "Email Required",
      description: "Please enter your email address to reset password",
      variant: "destructive"
    });
    return false;
  }

  if (!validateEmailFormat(resetEmail)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);
  
  try {
    console.log('Attempting password reset for email:', resetEmail);
    console.log('Redirect URL will be:', `${window.location.origin}/reset-password`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      handleAuthError(error, 'password reset');
      return false;
    }

    console.log('Password reset email sent successfully');
    toast({
      title: "Reset Email Sent",
      description: "Check your email for password reset instructions. If you don't see it, check your spam folder.",
    });
    return true;

  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'send reset email');
      } else {
        handleUnexpectedError(error, 'send reset email');
      }
    } else {
      toast({
        title: "Reset Failed",
        description: "Unable to send reset email. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};
