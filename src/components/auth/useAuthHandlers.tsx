
import { useState } from 'react';
import { handleSignIn, handleSignUp } from './handlers/authHandlers';
import { handleSendOTP, handleVerifyOTP } from './handlers/otpHandlers';
import { handleForgotPassword } from './handlers/passwordHandlers';

export const useAuthHandlers = () => {
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const signIn = async (phone: string, password: string): Promise<boolean> => 
    await handleSignIn(phone, password, setLoading);

  const signUp = async (phone: string, password: string, name: string, email: string): Promise<boolean> => 
    await handleSignUp(phone, password, name, email, setLoading);

  const sendOTP = async (phone: string, email: string, mode: 'signin' | 'signup'): Promise<boolean> => 
    await handleSendOTP(phone, email, mode, setLoading, setGeneratedOtp);

  const verifyOTP = async (otp: string, phone: string, email: string, name: string, mode: 'signin' | 'signup'): Promise<boolean> => 
    await handleVerifyOTP(otp, phone, email, name, mode, generatedOtp, setLoading);

  const forgotPassword = async (resetEmail: string): Promise<boolean> => 
    await handleForgotPassword(resetEmail, setLoading);

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
