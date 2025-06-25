
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);

  const isEmail = (value: string) => {
    return value.includes('@') && value.includes('.');
  };

  const handleSignIn = async () => {
    if (!phoneOrEmail || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone/email and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Determine if input is email or phone and format accordingly
    let signInEmail = phoneOrEmail;
    if (!isEmail(phoneOrEmail)) {
      // Convert phone to email format for login (remove any non-digits and add @demo.com)
      const cleanPhone = phoneOrEmail.replace(/\D/g, '');
      signInEmail = `${cleanPhone}@demo.com`;
    }

    console.log('Attempting sign in with email:', signInEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
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
    if (!phoneOrEmail || !password || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in phone/email, name, and password",
        variant: "destructive"
      });
      return;
    }

    // For signup, phone is mandatory, email is optional
    const isEmailInput = isEmail(phoneOrEmail);
    if (!isEmailInput) {
      // Phone number provided - this is the main flow
      const cleanPhone = phoneOrEmail.replace(/\D/g, '');
      const signupEmail = `${cleanPhone}@demo.com`;
      
      setLoading(true);
      
      console.log('Attempting sign up with email:', signupEmail);

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password,
        options: {
          data: {
            name,
            phone: phoneOrEmail
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
          title: "Account Created",
          description: "Account created successfully! You can now sign in.",
        });
      }
      setLoading(false);
    } else {
      // Email provided - optional flow
      toast({
        title: "Phone Required",
        description: "Please provide a phone number for driver registration",
        variant: "destructive"
      });
    }
  };

  const handleSendOTP = async () => {
    if (!phoneOrEmail || isEmail(phoneOrEmail)) {
      toast({
        title: "Phone Required",
        description: "Please enter a phone number to receive OTP",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setStep('otp');
    setLoading(false);
    
    toast({
      title: "OTP Sent",
      description: "Use 1234 as the OTP for demo purposes",
    });
  };

  const handleVerifyOTP = async () => {
    if (otp !== '1234') {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const cleanPhone = phoneOrEmail.replace(/\D/g, '');
    const demoEmail = `${cleanPhone}@demo.com`;
    const demoPassword = 'demo123456';

    console.log('Attempting OTP verification with email:', demoEmail);

    // Try to sign up first, if user exists it will fail and we'll sign in
    const { error: signUpError } = await supabase.auth.signUp({
      email: demoEmail,
      password: demoPassword,
      options: {
        data: {
          phone: phoneOrEmail,
          name: 'Demo Driver'
        }
      }
    });

    if (signUpError) {
      console.log('User might already exist, attempting sign in...');
      // User might already exist, try to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword
      });
      
      if (signInError) {
        console.error('Sign in after OTP failed:', signInError);
        toast({
          title: "Login Failed",
          description: signInError.message,
          variant: "destructive"
        });
      } else if (data.user) {
        console.log('OTP sign in successful:', data.user);
        toast({
          title: "Welcome!",
          description: "You have been signed in successfully",
        });
      }
    } else {
      console.log('OTP sign up successful');
      toast({
        title: "Welcome!",
        description: "Account created and signed in successfully",
      });
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
            {mode === 'signin' ? 'Welcome Back' : 'Join Taxiye'}
          </CardTitle>
          <p className="text-gray-400">
            {mode === 'signin' ? 'Sign in to continue driving' : 'Create your driver account'}
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
                  {mode === 'signup' ? 'Phone Number *' : 'Phone Number or Email'}
                </label>
                <Input
                  type="text"
                  placeholder={mode === 'signup' ? "+251911123456" : "Phone number or email"}
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
                {mode === 'signup' && (
                  <p className="text-xs text-gray-400 mt-1">
                    Phone number is required for driver registration
                  </p>
                )}
              </div>

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
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </Button>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Or continue with phone</div>
                <Button 
                  variant="outline"
                  onClick={handleSendOTP}
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                  disabled={!phoneOrEmail || isEmail(phoneOrEmail) || loading}
                >
                  {loading ? 'Sending...' : 'Send OTP to Phone'}
                </Button>
              </div>

              {mode === 'signin' && (
                <p className="text-sm text-gray-400 text-center">
                  You can sign in with either your phone number or email address
                </p>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP sent to {phoneOrEmail}
                </label>
                <Input
                  type="text"
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white text-center text-2xl"
                  maxLength={4}
                />
                <p className="text-sm text-gray-400 mt-2">Demo OTP: 1234</p>
              </div>
              <Button 
                onClick={handleVerifyOTP}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!otp || loading}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setStep('auth')}
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
