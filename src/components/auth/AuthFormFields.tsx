
import React from 'react';
import { Input } from '@/components/ui/input';

interface AuthFormFieldsProps {
  mode: 'signin' | 'signup';
  phone: string;
  email: string;
  password: string;
  name: string;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

const AuthFormFields = ({
  mode,
  phone,
  email,
  password,
  name,
  onPhoneChange,
  onEmailChange,
  onPasswordChange,
  onNameChange,
}: AuthFormFieldsProps) => {
  return (
    <>
      {mode === 'signup' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number *
        </label>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>

      {mode === 'signup' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password *
        </label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
    </>
  );
};

export default AuthFormFields;
