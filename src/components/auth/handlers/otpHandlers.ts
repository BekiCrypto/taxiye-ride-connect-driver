
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { validatePhone, validateEmail, getDriverAuthEmail } from '../utils/phoneUtils';
import { generateOTP, sendOTPToEmail, sendOTPToSMS } from '../utils/otpUtils';

export const handleSendOTP = async (
  phone: string, 
  email: string, 
  mode: 'signin' | 'signup',
  setLoading: (loading: boolean) => void,
  setGeneratedOtp: (otp: string) => void
) => {
  if (!phone) {
    toast({
      title: "Phone Required",
      description: "Please enter a phone number to receive OTP",
      variant: "destructive"
    });
    return false;
  }

  if (!validatePhone(phone)) {
    toast({
      title: "Invalid Phone",
      description: "Please enter a valid phone number", 
      variant: "destructive"
    });
    return false;
  }

  if (mode === 'signup' && email && !validateEmail(email)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return false;
  }
  
  setLoading(true);
  
  const otpCode = generateOTP();
  setGeneratedOtp(otpCode);
  
  await sendOTPToSMS(phone, otpCode);
  if (email) {
    await sendOTPToEmail(email, otpCode);
  }
  
  setLoading(false);
  
  toast({
    title: "OTP Sent",
    description: email ? `Verification code sent to both your phone and email` : `Verification code sent to your phone`,
  });
  
  return true;
};

export const handleVerifyOTP = async (
  otp: string, 
  phone: string, 
  email: string, 
  name: string, 
  mode: 'signin' | 'signup',
  generatedOtp: string,
  setLoading: (loading: boolean) => void
) => {
  if (!otp) {
    toast({
      title: "OTP Required",
      description: "Please enter the verification code",
      variant: "destructive"
    });
    return false;
  }

  if (otp !== generatedOtp) {
    toast({
      title: "Invalid OTP",
      description: "Please enter the correct verification code",
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);
  
  const authEmail = getDriverAuthEmail(phone);
  const defaultPassword = 'taxiye123456';

  console.log('Attempting OTP verification for phone:', phone, 'using auth email:', authEmail);

  if (mode === 'signin') {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: defaultPassword
    });

    if (signInError) {
      console.error('OTP sign in failed:', signInError);
      toast({
        title: "Sign In Failed",
        description: "No account found with this phone number",
        variant: "destructive"
      });
    } else if (signInData.user) {
      console.log('OTP sign in successful:', signInData.user);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });
    }
  } else {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: authEmail,
      password: defaultPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          phone: phone,
          name: name || 'Driver',
          email: email || null,
          user_type: 'driver' // This is crucial for the trigger to work
        }
      }
    });
    
    if (signUpError) {
      console.error('OTP sign up failed:', signUpError);
      toast({
        title: "Registration Failed",
        description: signUpError.message,
        variant: "destructive"
      });
    } else if (signUpData.user) {
      console.log('OTP sign up successful:', signUpData.user);
      toast({
        title: "Welcome!",
        description: "Account created successfully. Redirecting to document upload...",
      });
    }
  }
  
  setLoading(false);
  return true;
};
