
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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-md border-t border-green-500/30 z-[9999] shadow-2xl">
      <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center py-2 px-3 min-w-0 flex-1 rounded-2xl transition-all duration-300 transform ${
                isActive 
                  ? 'text-green-400 bg-green-400/20 scale-105 shadow-lg shadow-green-400/25' 
                  : 'text-gray-400 hover:text-green-300 hover:bg-green-400/10 hover:scale-105'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1 w-12 h-1 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
              )}
              <Icon className={`h-7 w-7 mb-1 transition-all duration-300 ${
                isActive ? 'scale-110 drop-shadow-lg' : 'hover:scale-105'
              }`} />
              <span className={`text-xs font-semibold transition-all duration-300 ${
                isActive ? 'text-green-400' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute inset-0 bg-green-400/5 rounded-2xl animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
