
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ForgotPasswordFormProps {
  resetEmail: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const ForgotPasswordForm = ({ resetEmail, loading, onEmailChange, onSubmit, onBack }: ForgotPasswordFormProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address *
        </label>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={resetEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
      
      <Button 
        onClick={onSubmit}
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={!resetEmail || loading}
      >
        {loading ? 'Sending...' : 'Send Reset Email'}
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

export default ForgotPasswordForm;
