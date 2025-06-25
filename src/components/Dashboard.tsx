
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { Bell, Wallet, HelpCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  walletBalance: number;
}

interface DashboardProps {
  user: User;
}

const Dashboard = ({ user }: DashboardProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const navigate = useNavigate();

  const todayStats = {
    earnings: 1250.75,
    trips: 8,
    hours: 6.5
  };

  const handleGoOnline = () => {
    setIsOnline(true);
    // Simulate receiving a ride request after going online
    setTimeout(() => {
      navigate('/ride-request');
    }, 3000);
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back,</h1>
          <p className="text-green-400 font-semibold">{user.name}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Online/Offline Toggle */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <h3 className="font-semibold text-white">
                  {isOnline ? 'You are ONLINE' : 'You are OFFLINE'}
                </h3>
                <p className="text-sm text-gray-400">
                  {isOnline ? 'Ready to receive ride requests' : 'Go online to start earning'}
                </p>
              </div>
            </div>
            <Switch 
              checked={isOnline} 
              onCheckedChange={isOnline ? setIsOnline : handleGoOnline}
            />
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {todayStats.earnings.toFixed(2)} ETB
            </div>
            <div className="text-sm text-gray-400">Today's Earnings</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{todayStats.trips}</div>
            <div className="text-sm text-gray-400">Trips</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{todayStats.hours}h</div>
            <div className="text-sm text-gray-400">Online Hours</div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Balance */}
      <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Wallet Balance</h3>
              <div className="text-3xl font-bold text-white">
                {user.walletBalance.toFixed(2)} ETB
              </div>
            </div>
            <Button 
              onClick={() => navigate('/wallet')}
              className="bg-white text-green-800 hover:bg-gray-100"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/wallet')}
          className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center"
        >
          <Wallet className="h-6 w-6 mb-1" />
          Top Up Wallet
        </Button>
        <Button 
          onClick={() => navigate('/support')}
          className="h-16 bg-gray-700 hover:bg-gray-600 flex flex-col items-center justify-center"
        >
          <HelpCircle className="h-6 w-6 mb-1" />
          Help & Support
        </Button>
      </div>

      {isOnline && (
        <Card className="bg-green-800 border-green-600">
          <CardContent className="p-4 text-center">
            <div className="animate-pulse">
              <div className="text-lg font-semibold text-white">Looking for rides...</div>
              <div className="text-sm text-green-200">You'll be notified when a request comes in</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
