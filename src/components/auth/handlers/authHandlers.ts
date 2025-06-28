
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { validatePhone, validateEmail, getDriverAuthEmail } from '../utils/phoneUtils';

export const handleSignIn = async (phone: string, password: string, setLoading: (loading: boolean) => void) => {
  if (!phone || !password) {
    toast({
      title: "Missing Information",
      description: "Please enter your phone number and password",
      variant: "destructive"
    });
    return;
  }

  if (!validatePhone(phone)) {
    toast({
      title: "Invalid Phone",
      description: "Please enter a valid phone number",
      variant: "destructive"
    });
    return;
  }

  setLoading(true);
  
  const authEmail = getDriverAuthEmail(phone);

  console.log('Attempting sign in with phone:', phone, 'using auth email:', authEmail);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password
  });

  if (error) {
    console.error('Sign in error:', error);
    toast({
      title: "Sign In Failed",
      description: error.message,
      variant: "destructive"
    });
  } else if (data.user) {
    console.log('Sign in successful:', data.user);
    toast({
      title: "Welcome back!",
      description: "You have been signed in successfully",
    });
  }
  setLoading(false);
};

export const handleSignUp = async (phone: string, password: string, name: string, email: string, setLoading: (loading: boolean) => void) => {
  if (!phone || !password || !name) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields",
      variant: "destructive"
    });
    return;
  }

  if (!validatePhone(phone)) {
    toast({
      title: "Invalid Phone",
      description: "Please enter a valid phone number",
      variant: "destructive"
    });
    return;
  }

  if (email && !validateEmail(email)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return;
  }

  setLoading(true);
  
  const authEmail = getDriverAuthEmail(phone);
  
  console.log('Attempting sign up with phone as primary key:', phone, 'using auth email:', authEmail);

  const { data, error } = await supabase.auth.signUp({
    email: authEmail,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        name,
        phone: phone,
        email: email || null,
        user_type: 'driver' // This is crucial for the trigger to work
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error);
    toast({
      title: "Sign Up Failed",
      description: error.message,
      variant: "destructive"
    });
  } else if (data.user) {
    console.log('Sign up successful:', data.user);
    toast({
      title: "Account Created Successfully!",
      description: "Redirecting to document upload...",
    });
  }
  setLoading(false);
};
