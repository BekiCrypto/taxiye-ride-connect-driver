
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { validateEmail } from '../utils/phoneUtils';

export const handleForgotPassword = async (resetEmail: string, setLoading: (loading: boolean) => void) => {
  if (!resetEmail) {
    toast({
      title: "Email Required",
      description: "Please enter your email address to reset password",
      variant: "destructive"
    });
    return false;
  }

  if (!validateEmail(resetEmail)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);
  
  console.log('Attempting password reset for email:', resetEmail);
  console.log('Redirect URL will be:', `${window.location.origin}/reset-password`);
  
  const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Password reset error:', error);
    toast({
      title: "Reset Failed",
      description: `Error: ${error.message}. Please check if this email exists in our system.`,
      variant: "destructive"
    });
  } else {
    console.log('Password reset email sent successfully');
    toast({
      title: "Reset Email Sent",
      description: "Check your email for password reset instructions. If you don't see it, check your spam folder.",
    });
  }
  
  setLoading(false);
  return !error;
};
