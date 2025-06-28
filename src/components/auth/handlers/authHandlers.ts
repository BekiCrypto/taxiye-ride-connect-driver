
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getDriverAuthEmail } from '../utils/phoneUtils';
import { validateAuthInput } from '../utils/validationUtils';
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
    toast({
      title: "Invalid Input",
      description: validation.error,
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);

  try {
    const authEmail = getDriverAuthEmail(phone);
    console.log('Attempting sign in with auth email:', authEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password
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

    // Shouldn't reach here, but handle just in case
    toast({
      title: "Sign In Failed",
      description: "No user data received. Please try again.",
      variant: "destructive"
    });
    return false;

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'sign in');
      } else {
        handleUnexpectedError(error, 'sign in');
      }
    } else {
      console.error('Unknown error during sign in:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
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
    toast({
      title: "Invalid Input",
      description: validation.error,
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);

  try {
    const authEmail = getDriverAuthEmail(phone);
    console.log('Attempting sign up with auth email:', authEmail);

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: name.trim(),
          phone: phone,
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
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to Taxiye! Redirecting to document upload...",
      });
      return true;
    }

    // Handle case where no error but no user (shouldn't happen)
    toast({
      title: "Registration Failed",
      description: "Account creation was incomplete. Please try again.",
      variant: "destructive"
    });
    return false;

  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'create account');
      } else {
        handleUnexpectedError(error, 'create account');
      }
    } else {
      console.error('Unknown error during sign up:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};
