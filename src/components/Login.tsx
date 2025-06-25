
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'auth' | 'otp'>('auth');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    const loginField = email || phone;
    
    if (!loginField || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter your email/phone and password",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Try to sign in with email first, then phone-based email
    let signInEmail = email;
    if (!email && phone) {
      // Convert phone to email format for login
      signInEmail = `${phone.replace(/\D/g, '')}@demo.com`;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password
    });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!phone || !password || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in phone number, name, and password (email is optional)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Use email if provided, otherwise create one from phone
    const signupEmail = email || `${phone.replace(/\D/g, '')}@demo.com`;
    
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password,
      options: {
        data: {
          name,
          phone
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Account Created",
        description: email ? "Please check your email to verify your account" : "Account created successfully",
      });
    }
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (!phone) return;
    
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
    
    const { error } = await supabase.auth.signUp({
      email: `${phone.replace(/\D/g, '')}@demo.com`,
      password: 'demo123456',
      options: {
        data: {
          phone: phone,
          name: 'Demo Driver'
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${phone.replace(/\D/g, '')}@demo.com`,
        password: 'demo123456'
      });
      
      if (signInError) {
        toast({
          title: "Login Failed",
          description: signInError.message,
          variant: "destructive"
        });
      }
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
                  Phone Number {mode === 'signup' ? '*' : ''}
                </label>
                <Input
                  type="tel"
                  placeholder="+251911123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required={mode === 'signup'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address {mode === 'signup' ? '(Optional)' : ''}
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
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
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </Button>

              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">Or continue with phone</div>
                <Button 
                  variant="outline"
                  onClick={handleSendOTP}
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                  disabled={!phone || loading}
                >
                  {loading ? 'Sending...' : 'Send OTP to Phone'}
                </Button>
              </div>

              {mode === 'signin' && (
                <p className="text-sm text-gray-400 text-center">
                  You can sign in with either your email or phone number
                </p>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP sent to {phone}
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
