
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AuthHeader from './auth/AuthHeader';
import AuthModeToggle from './auth/AuthModeToggle';
import AuthFormFields from './auth/AuthFormFields';
import OTPInput from './auth/OTPInput';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import { useAuthHandlers } from './auth/useAuthHandlers';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'auth' | 'otp' | 'forgot-password'>('auth');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [resetEmail, setResetEmail] = useState('');

  const {
    loading,
    handleSignIn,
    handleSignUp,
    handleSendOTP,
    handleVerifyOTP,
    handleForgotPassword,
    setGeneratedOtp
  } = useAuthHandlers();

  const onSignIn = async () => {
    const success = await handleSignIn(phone, password);
    // Success handling is done in the auth hook via toast and auth state change
  };

  const onSignUp = async () => {
    const success = await handleSignUp(phone, password, name, email);
    // Success handling is done in the auth hook via toast and auth state change
  };

  const onSendOTP = async () => {
    const success = await handleSendOTP(phone, email, mode);
    if (success) {
      setStep('otp');
    }
  };

  const onVerifyOTP = async () => {
    const success = await handleVerifyOTP(otp, phone, email, name, mode);
    if (success) {
      // Reset will happen automatically via auth state change
      resetToAuth();
    }
  };

  const onForgotPassword = async () => {
    const success = await handleForgotPassword(resetEmail);
    if (success) {
      setStep('auth');
      setResetEmail('');
    }
  };

  const resetToAuth = () => {
    setStep('auth');
    setOtp('');
    setGeneratedOtp('');
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <AuthHeader step={step} mode={mode} />
        <CardContent className="space-y-4">
          {step === 'auth' ? (
            <>
              <AuthModeToggle 
                mode={mode} 
                onModeChange={setMode} 
                disabled={loading} 
              />

              <AuthFormFields
                mode={mode}
                phone={phone}
                email={email}
                password={password}
                name={name}
                onPhoneChange={setPhone}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onNameChange={setName}
              />

              <Button 
                onClick={mode === 'signin' ? onSignIn : onSignUp}
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
                  onClick={onSendOTP}
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP to Phone & Email'}
                </Button>
              </div>
            </>
          ) : step === 'forgot-password' ? (
            <ForgotPasswordForm
              resetEmail={resetEmail}
              loading={loading}
              onEmailChange={setResetEmail}
              onSubmit={onForgotPassword}
              onBack={resetToAuth}
            />
          ) : (
            <OTPInput
              otp={otp}
              email={email}
              loading={loading}
              onOtpChange={setOtp}
              onVerify={onVerifyOTP}
              onBack={resetToAuth}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
