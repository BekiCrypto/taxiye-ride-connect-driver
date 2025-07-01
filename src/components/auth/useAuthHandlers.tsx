
import { useState } from 'react';
import { handleSignIn, handleSignUp } from './handlers/authHandlers';
import { handleSendOTP, handleVerifyOTP } from './handlers/otpHandlers';
import { handleForgotPassword } from './handlers/passwordHandlers';

export const useAuthHandlers = (onLogin: () => void) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [userType, setUserType] = useState<'driver' | 'passenger'>('driver');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleAuth = async () => {
    setError('');
    setSuccess('');
    
    if (isLogin) {
      const result = await handleSignIn(phone, password, setLoading);
      if (result) {
        onLogin();
      } else {
        setError('Invalid credentials');
      }
    } else {
      const result = await handleSignUp(phone, password, name, email, setLoading);
      if (result) {
        setShowOTP(true);
        setSuccess('OTP sent to your phone');
      } else {
        setError('Registration failed');
      }
    }
  };

  const handleVerifyOTPWrapper = async () => {
    const result = await handleVerifyOTP(otp, phone, email, name, isLogin ? 'signin' : 'signup', generatedOtp, setLoading);
    if (result) {
      onLogin();
    } else {
      setError('Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    const result = await handleSendOTP(phone, email, isLogin ? 'signin' : 'signup', setLoading, setGeneratedOtp);
    if (result) {
      setSuccess('OTP resent successfully');
    } else {
      setError('Failed to resend OTP');
    }
  };

  return {
    isLogin,
    setIsLogin,
    phone,
    setPhone,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    otp,
    setOtp,
    showOTP,
    setShowOTP,
    loading,
    error,
    success,
    showForgotPassword,
    setShowForgotPassword,
    userType,
    setUserType,
    handleAuth,
    handleVerifyOTP: handleVerifyOTPWrapper,
    handleResendOTP,
    generatedOtp,
    setGeneratedOtp
  };
};
