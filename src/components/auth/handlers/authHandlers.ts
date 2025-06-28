
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getDriverAuthEmail } from '../utils/phoneUtils';
import { validateAuthInput, showValidationError } from '../utils/validationUtils';
import { handleAuthError, handleNetworkError, handleUnexpectedError } from '../utils/errorUtils';

export const handleSignIn = async (
  phone: string, 
  password: string, 
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  console.log('Starting sign in process for phone:', phone);

  // Validate input
  const validation = validateAuthInput(phone, password, undefined, undefined, 'signin');
  if (!validation.isValid) {
    showValidationError(validation.error!);
    return false;
  }

  setLoading(true);

  try {
    const authEmail = getDriverAuthEmail(phone);
    
    console.log('Attempting sign in with auth email:', authEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: password
    });

    if (error) {
      handleAuthError(error, 'sign in');
      return false;
    }

    if (data.user) {
      console.log('Sign in successful:', data.user.id);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });
      return true;
    }

    return false;

  } catch (error) {
    console.error('Unexpected error during sign in:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'sign in');
      } else {
        handleUnexpectedError(error, 'sign in');
      }
    } else {
      toast({
        title: "Sign In Failed",
        description: "Unable to sign in. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};

export const handleSignUp = async (
  phone: string, 
  password: string, 
  name: string, 
  email: string, 
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  console.log('Starting sign up process for phone:', phone);

  // Validate input
  const validation = validateAuthInput(phone, password, name, email, 'signup');
  if (!validation.isValid) {
    showValidationError(validation.error!);
    return false;
  }

  setLoading(true);

  try {
    const authEmail = getDriverAuthEmail(phone);
    
    console.log('Attempting sign up with auth email:', authEmail);

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          phone: phone,
          name: name ? name.trim() : 'Driver',
          email: email ? email.trim() : null,
          user_type: 'driver'
        }
      }
    });

    if (error) {
      handleAuthError(error, 'sign up');
      return false;
    }

    if (data.user) {
      console.log('Sign up successful:', data.user.id);
      
      if (data.user.email_confirmed_at) {
        toast({
          title: "Welcome to Taxiye!",
          description: "Account created successfully. Redirecting to document upload...",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email and click the confirmation link to complete registration.",
        });
      }
      return true;
    }

    return false;

  } catch (error) {
    console.error('Unexpected error during sign up:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'sign up');
      } else {
        handleUnexpectedError(error, 'sign up');
      }
    } else {
      toast({
        title: "Sign Up Failed",
        description: "Unable to create account. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};

export const handleResendConfirmation = async (phone: string): Promise<boolean> => {
  console.log('Resending confirmation email for phone:', phone);
  
  try {
    const authEmail = getDriverAuthEmail(phone);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: authEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      handleAuthError(error, 'resend confirmation');
      return false;
    }

    toast({
      title: "Confirmation Email Sent",
      description: "A new confirmation email has been sent. Please check your inbox.",
    });
    return true;

  } catch (error) {
    console.error('Error resending confirmation:', error);
    handleUnexpectedError(error as Error, 'resend confirmation email');
    return false;
  }
};
