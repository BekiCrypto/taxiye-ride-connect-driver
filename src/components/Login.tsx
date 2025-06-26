import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'auth' | 'otp' | 'forgot-password'>('auth');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resetEmail, setResetEmail] = useState('');

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
    // Simulate email OTP sending - in production, you'd use a service like Resend
    console.log(`Sending OTP ${otpCode} to email: ${emailAddress}`);
    toast({
      title: "Email OTP Sent",
      description: `OTP ${otpCode} sent to ${emailAddress} (simulated)`,
    });
  };

  const sendOTPToSMS = async (phoneNumber: string, otpCode: string) => {
    // Simulate SMS OTP sending - in production, you'd use a service like Twilio
    console.log(`Sending OTP ${otpCode} to phone: ${phoneNumber}`);
    toast({
      title: "SMS OTP Sent", 
      description: `OTP ${otpCode} sent to ${phoneNumber} (simulated)`,
    });
  };

  const handleSignIn = async () => {
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
    
    // Use phone as primary identifier - create email format for auth
    const cleanPhone = phone.replace(/\D/g, '');
    const authEmail = `${cleanPhone}@driver.taxiye.com`;

    console.log('Attempting sign in with phone:', phone);

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

  const handleSignUp = async () => {
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
    
    // Use phone as primary key - create auth email format
    const cleanPhone = phone.replace(/\D/g, '');
    const authEmail = `${cleanPhone}@driver.taxiye.com`;
    
    console.log('Attempting sign up with phone as primary key:', phone);

    const { data, error } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name,
          phone: phone,
          email: email || null, // Store actual email in metadata, can be null
          user_type: 'driver'
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

  const handleSendOTP = async () => {
    if (!phone) {
      toast({
        title: "Phone Required",
        description: "Please enter a phone number to receive OTP",
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

    if (mode === 'signup' && email && !validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Generate OTP
    const otpCode = generateOTP();
    setGeneratedOtp(otpCode);
    
    // Send OTP to phone and email (if provided)
    await sendOTPToSMS(phone, otpCode);
    if (email) {
      await sendOTPToEmail(email, otpCode);
    }
    
    setStep('otp');
    setLoading(false);
    
    toast({
      title: "OTP Sent",
      description: email ? `Verification code sent to both your phone and email` : `Verification code sent to your phone`,
    });
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code",
        variant: "destructive"
      });
      return;
    }

    if (otp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct verification code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const cleanPhone = phone.replace(/\D/g, '');
    const authEmail = `${cleanPhone}@driver.taxiye.com`;
    const defaultPassword = 'taxiye123456';

    console.log('Attempting OTP verification for phone:', phone);

    if (mode === 'signin') {
      // Try to sign in existing user
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
      // Create new user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: authEmail,
        password: defaultPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: phone,
            name: name || 'Driver',
            email: email || null,
            user_type: 'driver'
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
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to reset password",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(resetEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
      setStep('auth');
      setResetEmail('');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {step === 'forgot-password' 
              ? 'Reset Password' 
              : mode === 'signin' 
                ? 'Welcome Back' 
                : 'Join Taxiye as a Driver'
            }
          </CardTitle>
          <p className="text-gray-400">
            {step === 'forgot-password'
              ? 'Enter your email to reset your password'
              : mode === 'signin' 
                ? 'Sign in to continue driving' 
                : 'Create your driver account and start earning'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'auth' ? (
            <>
              <div className="flex rounded-lg bg-gray-700 p-1 mb-4">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    mode === 'signin'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    mode === 'signup'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password *
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <Button 
                onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Driver Account')}
              </Button>

              {mode === 'signin' && (
                <div className="text-center">
                  <Button 
                    variant="ghost"
                    onClick={() => setStep('forgot-password')}
                    className="text-gray-400 hover:text-white text-sm p-0 h-auto"
                    disabled={loading}
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Or verify with OTP</div>
                <Button 
                  variant="outline"
                  onClick={handleSendOTP}
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP to Phone & Email'}
                </Button>
              </div>
            </>
          ) : step === 'forgot-password' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              
              <Button 
                onClick={handleForgotPassword}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!resetEmail || loading}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => {
                  setStep('auth');
                  setResetEmail('');
                }}
                className="w-full text-gray-400"
                disabled={loading}
              >
                Back to Login
              </Button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter verification code sent to your phone{email ? ' and email' : ''}
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Check your phone SMS{email ? ' and email' : ''} for the verification code
                </p>
              </div>
              <Button 
                onClick={handleVerifyOTP}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!otp || otp.length !== 4 || loading}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  setStep('auth');
                  setOtp('');
                  setGeneratedOtp('');
                }}
                className="w-full text-gray-400"
                disabled={loading}
              >
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
