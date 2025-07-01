
import React from 'react';
import { Input } from '@/components/ui/input';

interface AuthFormFieldsProps {
  isLogin: boolean;
  phone: string;
  email: string;
  password: string;
  name: string;
  setPhone: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setName: (value: string) => void;
  userType: string;
}

const AuthFormFields = ({
  isLogin,
  phone,
  email,
  password,
  name,
  setPhone,
  setEmail,
  setPassword,
  setName,
}: AuthFormFieldsProps) => {
  return (
    <>
      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {isLogin ? 'Phone Number or Email *' : 'Phone Number *'}
        </label>
        <Input
          type={isLogin ? 'text' : 'tel'}
          placeholder={isLogin ? 'Enter your phone number or email' : 'Enter your phone number'}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>

      {!isLogin && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
      </div>
    </>
  );
};

export default AuthFormFields;
