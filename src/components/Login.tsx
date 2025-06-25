
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone) return;
    
    setLoading(true);
    // For demo purposes, we'll skip real OTP and just simulate the flow
    // In production, you'd integrate with a real SMS service
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
    
    // For demo, create a test user with the phone number
    const { error } = await supabase.auth.signUp({
      email: `${phone.replace(/\D/g, '')}@demo.com`, // Convert phone to email format for demo
      password: 'demo123456',
      options: {
        data: {
          phone: phone,
          name: 'Demo Driver'
        }
      }
    });

    if (error) {
      // If user already exists, try to sign in
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
                disabled={!phone || loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
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
                onClick={() => setStep('phone')}
                className="w-full text-gray-400"
                disabled={loading}
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
