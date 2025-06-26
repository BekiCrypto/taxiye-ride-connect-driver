
import React from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

interface OTPInputProps {
  otp: string;
  email: string;
  loading: boolean;
  onOtpChange: (value: string) => void;
  onVerify: () => void;
  onBack: () => void;
}

const OTPInput = ({ otp, email, loading, onOtpChange, onVerify, onBack }: OTPInputProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Enter verification code sent to your phone{email ? ' and email' : ''}
        </label>
        <div className="flex justify-center">
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={(value) => onOtpChange(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Check your phone SMS{email ? ' and email' : ''} for the verification code
        </p>
      </div>
      <Button 
        onClick={onVerify}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={!otp || otp.length !== 4 || loading}
      >
        {loading ? 'Verifying...' : 'Verify & Continue'}
      </Button>
      <Button 
        variant="ghost"
        onClick={onBack}
        className="w-full text-gray-400"
        disabled={loading}
      >
        Back to Login
      </Button>
    </>
  );
};

export default OTPInput;
