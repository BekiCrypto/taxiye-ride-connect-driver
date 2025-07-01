
import React, { useEffect, useState } from 'react';
import { Car } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Car className="h-12 w-12 text-blue-600" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-white/30 rounded-full animate-spin mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">ETDS</h1>
          <p className="text-xl opacity-90">Electronic Taxi Dispatch System</p>
          <p className="text-sm opacity-75">Directive Compliant</p>
        </div>

        <div className="w-64 bg-white/20 rounded-full h-2 mx-auto">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm opacity-75">Loading system...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
