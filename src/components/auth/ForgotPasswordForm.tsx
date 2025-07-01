
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { handleForgotPassword } from './handlers/passwordHandlers';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    const result = await handleForgotPassword(resetEmail, setLoading);
    if (result) {
      setSuccess('Reset email sent successfully');
    } else {
      setError('Failed to send reset email');
    }
  };

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
          onChange={(e) => setResetEmail(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>

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
        onClick={handleSubmit}
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
