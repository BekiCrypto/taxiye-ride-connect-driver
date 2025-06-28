
import { useState } from 'react';
import { handleSignIn, handleSignUp } from './handlers/authHandlers';
import { handleSendOTP, handleVerifyOTP } from './handlers/otpHandlers';
import { handleForgotPassword } from './handlers/passwordHandlers';

export const useAuthHandlers = () => {
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const signIn = (phone: string, password: string) => 
    handleSignIn(phone, password, setLoading);

  const signUp = (phone: string, password: string, name: string, email: string) => 
    handleSignUp(phone, password, name, email, setLoading);

  const sendOTP = (phone: string, email: string, mode: 'signin' | 'signup') => 
    handleSendOTP(phone, email, mode, setLoading, setGeneratedOtp);

  const verifyOTP = (otp: string, phone: string, email: string, name: string, mode: 'signin' | 'signup') => 
    handleVerifyOTP(otp, phone, email, name, mode, generatedOtp, setLoading);

  const forgotPassword = (resetEmail: string) => 
    handleForgotPassword(resetEmail, setLoading);

  return {
    loading,
    generatedOtp,
    handleSignIn: signIn,
    handleSignUp: signUp,
    handleSendOTP: sendOTP,
    handleVerifyOTP: verifyOTP,
    handleForgotPassword: forgotPassword,
    setGeneratedOtp
  };
};
