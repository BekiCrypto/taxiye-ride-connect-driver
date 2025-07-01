
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, User, Shield } from 'lucide-react';

interface UserTypeSelectorProps {
  onSelectType: (type: 'driver' | 'passenger' | 'admin') => void;
}

const UserTypeSelector = ({ onSelectType }: UserTypeSelectorProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
            alt="Taxiye Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Taxiye</h1>
          <p className="text-gray-400">Electronic Taxi Dispatch System - ኤታስ' Directive Compliant</p>
          <p className="text-lg text-gray-300 mt-4">How would you like to join us?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Driver Option */}
          <Card 
            className="bg-gradient-to-b from-green-900/30 to-green-800/30 border-green-700/50 hover:border-green-500/70 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectType('driver')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-green-600/20 rounded-full group-hover:bg-green-600/30 transition-colors">
                <Car className="h-12 w-12 text-green-400" />
              </div>
              <CardTitle className="text-white text-xl">Driver</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-gray-300">
                Start earning by driving passengers safely around the city
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Flexible working hours</li>
                <li>• Competitive earnings</li>
                <li>• Insurance coverage</li>
                <li>• 24/7 support</li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
                Join as Driver
              </Button>
            </CardContent>
          </Card>

          {/* Passenger Option */}
          <Card 
            className="bg-gradient-to-b from-blue-900/30 to-blue-800/30 border-blue-700/50 hover:border-blue-500/70 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectType('passenger')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-blue-600/20 rounded-full group-hover:bg-blue-600/30 transition-colors">
                <User className="h-12 w-12 text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">Passenger</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-gray-300">
                Book safe and reliable rides anywhere in the city
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Quick booking</li>
                <li>• Safe rides</li>
                <li>• Fair pricing</li>
                <li>• Real-time tracking</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                Join as Passenger
              </Button>
            </CardContent>
          </Card>

          {/* Admin Option */}
          <Card 
            className="bg-gradient-to-b from-purple-900/30 to-purple-800/30 border-purple-700/50 hover:border-purple-500/70 transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectType('admin')}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-purple-600/20 rounded-full group-hover:bg-purple-600/30 transition-colors">
                <Shield className="h-12 w-12 text-purple-400" />
              </div>
              <CardTitle className="text-white text-xl">Admin</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <p className="text-gray-300">
                Manage the platform and ensure compliance with regulations
              </p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Driver verification</li>
                <li>• System monitoring</li>
                <li>• Compliance management</li>
                <li>• Analytics dashboard</li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4">
                Admin Access
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Already have an account? 
            <span className="text-green-400 cursor-pointer hover:text-green-300 ml-1">
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
