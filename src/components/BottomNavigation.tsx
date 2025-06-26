
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, HelpCircle, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-3 px-4 min-w-0 flex-1 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-green-400 bg-green-400/10 scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              {isActive && (
                <div className="absolute top-1 w-8 h-0.5 bg-green-400 rounded-full"></div>
              )}
              <Icon className={`h-6 w-6 mb-1 transition-transform duration-300 ${
                isActive ? 'scale-110' : ''
              }`} />
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'text-green-400' : ''
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute inset-0 bg-green-400/5 rounded-xl animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
