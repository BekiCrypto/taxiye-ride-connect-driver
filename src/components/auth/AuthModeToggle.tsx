
import React from 'react';

interface AuthModeToggleProps {
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  disabled?: boolean;
}

const AuthModeToggle = ({ mode, onModeChange, disabled }: AuthModeToggleProps) => {
  return (
    <div className="flex rounded-lg bg-gray-700 p-1 mb-4">
      <button
        onClick={() => onModeChange('signin')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          mode === 'signin'
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
        disabled={disabled}
      >
        Sign In
      </button>
      <button
        onClick={() => onModeChange('signup')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          mode === 'signup'
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
