
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <img 
            src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
            alt="Taxiye Logo" 
            className="h-24 w-auto mx-auto"
          />
        </div>
        <div className="text-white text-lg font-medium mb-4">Taxiye Driver</div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
