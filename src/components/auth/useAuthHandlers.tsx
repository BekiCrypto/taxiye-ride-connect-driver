
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuthHandlers = () => {
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const validatePhone = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return cleanPhone.length >= 10;
  };

  const validateEmail = (emailAddress: string) => {
    return emailAddress.includes('@') && emailAddress.includes('.');
  };

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendOTPToEmail = async (emailAddress: string, otpCode: string) => {
    console.log(`Sending OTP ${otpCode} to email: ${emailAddress}`);
    toast({
      title: "Email OTP Sent",
      description: `OTP ${otpCode} sent to ${emailAddress} (simulated)`,
    });
  };

  const sendOTPToSMS = async (phoneNumber: string, otpCode: string) => {
    console.log(`Sending OTP ${otpCode} to phone: ${phoneNumber}`);
    toast({
      title: "SMS OTP Sent", 
      description: `OTP ${otpCode} sent to ${phoneNumber} (simulated)`,
    });
  };

  // Helper function to get the driver-specific auth email
  const getDriverAuthEmail = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    // Remove leading zeros and ensure we have a valid format
    const normalizedPhone = cleanPhone.replace(/^0+/, '');
    // Add a prefix to make it a valid email format
    return `driver${normalizedPhone}@taxiye.com`;
  };

  const handleSignIn = async (phone: string, password: string) => {
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

  const handleSignUp = async (phone: string, password: string, name: string, email: string) => {
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

  const handleSendOTP = async (phone: string, email: string, mode: 'signin' | 'signup') => {
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

  const handleVerifyOTP = async (otp: string, phone: string, email: string, name: string, mode: 'signin' | 'signup') => {
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

  const handleForgotPassword = async (resetEmail: string) => {
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

  return {
    loading,
    generatedOtp,
    handleSignIn,
    handleSignUp,
    handleSendOTP,
    handleVerifyOTP,
    handleForgotPassword,
    setGeneratedOtp
  };
};
