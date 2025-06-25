
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOTP = () => {
    if (phone) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') { // Simulate OTP verification
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <div className="text-2xl font-bold text-white">T</div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Taxiye Driver</CardTitle>
          <p className="text-gray-400">Welcome back, driver!</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'phone' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+251911123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button 
                onClick={handleSendOTP}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!phone}
              >
                Send OTP
              </Button>
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
              </div>
              <Button 
                onClick={handleVerifyOTP}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!otp}
              >
                Verify & Login
              </Button>
              <Button 
                variant="ghost"
                onClick={() => setStep('phone')}
                className="w-full text-gray-400"
              >
                Change Phone Number
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
