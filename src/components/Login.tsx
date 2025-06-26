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
    
    let signInEmail = phoneOrEmail;
    if (!isEmail(phoneOrEmail)) {
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

    const isEmailInput = isEmail(phoneOrEmail);
    if (!isEmailInput) {
      const cleanPhone = phoneOrEmail.replace(/\D/g, '');
      const signupEmail = `${cleanPhone}@demo.com`;
      
      setLoading(true);
      
      console.log('Attempting sign up with email:', signupEmail);

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            phone: phoneOrEmail,
            user_type: 'driver' // Mark as driver for proper profile creation
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
        // The App component will handle redirection to KYC automatically
      }
      setLoading(false);
    } else {
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

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword
    });

    if (signInError) {
      console.log('User does not exist, creating new user...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            phone: phoneOrEmail,
            name: name || 'Demo Driver',
            user_type: 'driver'
          }
        }
      });
      
      if (signUpError) {
        console.error('Sign up after OTP failed:', signUpError);
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive"
        });
      } else if (signUpData.user) {
        console.log('OTP sign up successful:', signUpData.user);
        toast({
          title: "Welcome!",
          description: "Redirecting to document upload...",
        });
      }
    } else if (signInData.user) {
      console.log('OTP sign in successful:', signInData.user);
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully",
      });
    }
    
    setLoading(false);
  };

  const createTestUser = async () => {
    setLoading(true);
    console.log('Creating test user...');
    
    const testEmail = '911300466@demo.com';
    const testPassword = 'demo123456';
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name: 'Test Driver',
          phone: '+251911300466',
          user_type: 'driver'
        }
      }
    });

    if (error) {
      console.error('Test user creation error:', error);
      toast({
        title: "Test User Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('Test user created successfully');
      toast({
        title: "Test User Created",
        description: "Test credentials are now ready. Try signing in with phone: 911300466 and password: demo123456",
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
            {mode === 'signin' ? 'Welcome Back' : 'Join Taxiye as a Driver'}
          </CardTitle>
          <p className="text-gray-400">
            {mode === 'signin' ? 'Sign in to continue driving' : 'Create your driver account and start earning'}
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
                  Phone Number or Email
                </label>
                <Input
                  type="text"
                  placeholder="Enter phone number or email"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
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
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Driver Account')}
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

              <div className="text-center border-t border-gray-600 pt-4">
                <div className="text-xs text-gray-400 mb-2">
                  Test Credentials: Phone: 911300466, Password: demo123456
                </div>
                <Button 
                  variant="ghost"
                  onClick={createTestUser}
                  className="text-xs text-gray-400 hover:text-white"
                  disabled={loading}
                >
                  Create Test User (if needed)
                </Button>
              </div>
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
                {loading ? 'Verifying...' : 'Verify & Continue'}
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
