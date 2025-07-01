
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface AuthHeaderProps {
  step: 'auth' | 'otp' | 'forgot-password';
  mode: 'signin' | 'signup';
}

const AuthHeader = ({ step, mode }: AuthHeaderProps) => {
  const getTitle = () => {
    if (step === 'forgot-password') return 'Reset Password';
    return mode === 'signin' ? 'Welcome Back' : 'Join ETDS as a Driver';
  };

  const getDescription = () => {
    if (step === 'forgot-password') return 'Enter your email to reset your password';
    return mode === 'signin' 
      ? 'Sign in to continue driving' 
      : 'Create your driver account and start earning';
  };

  return (
    <CardHeader className="text-center">
      <div className="mx-auto mb-4">
        <img 
          src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
          alt="ETDS Logo" 
          className="h-16 w-auto mx-auto"
        />
      </div>
      <CardTitle className="text-2xl font-bold text-white">
        {getTitle()}
      </CardTitle>
      <p className="text-gray-400">
        {getDescription()}
      </p>
    </CardHeader>
  );
};

export default AuthHeader;
