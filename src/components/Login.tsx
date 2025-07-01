
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car, User, AlertCircle } from 'lucide-react';
import { useAuthHandlers } from './auth/useAuthHandlers';
import AuthFormFields from './auth/AuthFormFields';
import AuthModeToggle from './auth/AuthModeToggle';
import OTPInput from './auth/OTPInput';
import ForgotPasswordForm from './auth/ForgotPasswordForm';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const {
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
    handleVerifyOTP,
    handleResendOTP
  } = useAuthHandlers(onLogin);

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Car className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Electronic Taxi Dispatch System (ETDS)</p>
              <p className="text-xs text-gray-500">Directive Compliant</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-white">ETDS</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Electronic Taxi Dispatch System</p>
            <p className="text-xs text-gray-500">Directive Compliant</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showOTP ? (
            <>
              <AuthModeToggle isLogin={isLogin} setIsLogin={setIsLogin} />
              
              <Tabs value={userType} onValueChange={(value) => setUserType(value as 'driver' | 'passenger')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="driver" className="flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <span>Driver</span>
                  </TabsTrigger>
                  <TabsTrigger value="passenger" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Passenger</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="driver" className="space-y-4 mt-4">
                  <AuthFormFields
                    isLogin={isLogin}
                    phone={phone}
                    setPhone={setPhone}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    name={name}
                    setName={setName}
                    userType="driver"
                  />
                </TabsContent>

                <TabsContent value="passenger" className="space-y-4 mt-4">
                  <AuthFormFields
                    isLogin={isLogin}
                    phone={phone}
                    setPhone={setPhone}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    name={name}
                    setName={setName}
                    userType="passenger"
                  />
                </TabsContent>
              </Tabs>

              {error && (
                <Alert className="bg-red-900/50 border-red-700/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-900/50 border-green-700/50">
                  <AlertDescription className="text-green-200">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAuth}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>

              {isLogin && (
                <div className="text-center">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </>
          ) : (
            <OTPInput
              otp={otp}
              setOtp={setOtp}
              phone={phone}
              loading={loading}
              error={error}
              success={success}
              onVerify={handleVerifyOTP}
              onResend={handleResendOTP}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
