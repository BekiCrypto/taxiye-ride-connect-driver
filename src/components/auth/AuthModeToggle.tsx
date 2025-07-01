
import React from 'react';

interface AuthModeToggleProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  disabled?: boolean;
}

const AuthModeToggle = ({ isLogin, setIsLogin, disabled }: AuthModeToggleProps) => {
  return (
    <div className="flex rounded-lg bg-gray-700 p-1 mb-4">
      <button
        onClick={() => setIsLogin(true)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          isLogin
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
        disabled={disabled}
      >
        Sign In
      </button>
      <button
        onClick={() => setIsLogin(false)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          !isLogin
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
        disabled={disabled}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthModeToggle;
