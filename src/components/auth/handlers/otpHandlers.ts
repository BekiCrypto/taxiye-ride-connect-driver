
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getDriverAuthEmail } from '../utils/phoneUtils';
import { validatePhoneNumber, validateEmailFormat, validateOTP } from '../utils/validationUtils';
import { generateOTP, sendOTPToEmail, sendOTPToSMS } from '../utils/otpUtils';
import { handleAuthError, handleNetworkError, handleUnexpectedError } from '../utils/errorUtils';

export const handleSendOTP = async (
  phone: string, 
  email: string, 
  mode: 'signin' | 'signup',
  setLoading: (loading: boolean) => void,
  setGeneratedOtp: (otp: string) => void
): Promise<boolean> => {
  console.log('Starting OTP send process for phone:', phone, 'mode:', mode);

  // Validate phone number
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) {
    toast({
      title: "Invalid Phone Number",
      description: phoneValidation.error,
      variant: "destructive"
    });
    return false;
  }

  // Validate email if provided
  if (email && !validateEmailFormat(email)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);

  try {
    // Generate and store OTP
    const otpCode = generateOTP();
    setGeneratedOtp(otpCode);
    
    console.log('Generated OTP:', otpCode, 'for phone:', phone);

    // Send OTP via SMS (simulated)
    await sendOTPToSMS(phone, otpCode);
    
    // Send OTP via email if provided (simulated)
    if (email) {
      await sendOTPToEmail(email, otpCode);
    }
    
    toast({
      title: "Verification Code Sent",
      description: email 
        ? "Check your phone SMS and email for the verification code" 
        : "Check your phone SMS for the verification code",
    });
    
    return true;

  } catch (error) {
    console.error('Error sending OTP:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'send verification code');
      } else {
        handleUnexpectedError(error, 'send verification code');
      }
    } else {
      toast({
        title: "Failed to Send Code",
        description: "Unable to send verification code. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};

export const handleVerifyOTP = async (
  otp: string, 
  phone: string, 
  email: string, 
  name: string, 
  mode: 'signin' | 'signup',
  generatedOtp: string,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  console.log('Starting OTP verification for phone:', phone, 'mode:', mode);

  // Validate OTP
  const otpValidation = validateOTP(otp, generatedOtp);
  if (!otpValidation.isValid) {
    toast({
      title: "Invalid Code",
      description: otpValidation.error,
      variant: "destructive"
    });
    return false;
  }

  setLoading(true);

  try {
    const authEmail = getDriverAuthEmail(phone);
    const defaultPassword = 'taxiye123456';

    console.log('Attempting OTP verification with auth email:', authEmail);

    if (mode === 'signin') {
      return await handleOTPSignIn(authEmail, defaultPassword);
    } else {
      return await handleOTPSignUp(authEmail, defaultPassword, phone, name, email);
    }

  } catch (error) {
    console.error('Error during OTP verification:', error);
    
    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, 'verify code');
      } else {
        handleUnexpectedError(error, 'verify code');
      }
    } else {
      toast({
        title: "Verification Failed",
        description: "Unable to verify code. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  } finally {
    setLoading(false);
  }
};

const handleOTPSignIn = async (authEmail: string, password: string): Promise<boolean> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password: password
  });

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      toast({
        title: "Account Not Found",
        description: "No account found with this phone number. Please sign up first.",
        variant: "destructive"
      });
    } else {
      handleAuthError(error, 'OTP sign in');
    }
    return false;
  }

  if (data.user) {
    console.log('OTP sign in successful:', data.user.id);
    toast({
      title: "Welcome back!",
      description: "You have been signed in successfully",
    });
    return true;
  }

  return false;
};

const handleOTPSignUp = async (
  authEmail: string, 
  password: string, 
  phone: string, 
  name: string, 
  email: string
): Promise<boolean> => {
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
    handleAuthError(error, 'OTP sign up');
    return false;
  }

  if (data.user) {
    console.log('OTP sign up successful:', data.user.id);
    toast({
      title: "Welcome to Taxiye!",
      description: "Account created successfully. Redirecting to document upload...",
    });
    return true;
  }

  return false;
};
