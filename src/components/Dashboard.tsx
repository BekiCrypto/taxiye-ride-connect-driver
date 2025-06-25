
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Car, DollarSign, Clock, Navigation, Bell, HelpCircle } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useRides } from '@/hooks/useRides';
import { toast } from '@/components/ui/use-toast';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { driver, updateDriverProfile } = useDriverAuth();
  const { rides } = useRides();

  const handleOnlineToggle = async (checked: boolean) => {
    if (!driver) return;

    const result = await updateDriverProfile({ is_online: checked });
    if (result) {
      toast({
        title: checked ? "You're now online" : "You're now offline",
        description: checked ? "You can receive ride requests" : "You won't receive ride requests",
      });
    }
  };

  // Calculate today's stats
  const today = new Date().toDateString();
  const todayRides = rides.filter(ride => 
    new Date(ride.created_at).toDateString() === today && ride.status === 'completed'
  );
  const todayEarnings = todayRides.reduce((sum, ride) => sum + (ride.net_earnings || 0), 0);

  if (!driver) return null;

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
          <p className="text-gray-400">{driver.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">
            {driver.is_online ? 'Online' : 'Offline'}
          </span>
          <Switch
            checked={driver.is_online}
            onCheckedChange={handleOnlineToggle}
          />
          <div className={`w-3 h-3 rounded-full ${
            driver.is_online ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>
      </div>

      {/* Status Card */}
      {driver.approved_status !== 'approved' && (
        <Card className="bg-yellow-900 border-yellow-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <div className="text-yellow-100 font-medium">
                  Account Status: {driver.approved_status.toUpperCase()}
                </div>
                <div className="text-yellow-200 text-sm">
                  {driver.approved_status === 'pending' 
                    ? 'Your documents are being reviewed'
                    : 'Please update your documents'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">
                  {todayEarnings.toFixed(2)} ETB
                </div>
                <div className="text-gray-400 text-sm">Today's Earnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{todayRides.length}</div>
                <div className="text-gray-400 text-sm">Trips Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Balance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-white">Wallet Balance</div>
              <div className="text-2xl font-bold text-green-400">
                {driver.wallet_balance.toFixed(2)} ETB
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('wallet')}
              className="bg-green-600 hover:bg-green-700"
            >
              Top Up
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        
        <Button
          onClick={() => onNavigate('notifications')}
          className="w-full h-12 bg-gray-800 border border-gray-700 hover:bg-gray-700 flex items-center justify-start space-x-3"
          variant="outline"
        >
          <Bell className="h-5 w-5" />
          <span>Notifications</span>
        </Button>

        <Button
          onClick={() => onNavigate('support')}
          className="w-full h-12 bg-gray-800 border border-gray-700 hover:bg-gray-700 flex items-center justify-start space-x-3"
          variant="outline"
        >
          <HelpCircle className="h-5 w-5" />
          <span>Help & Support</span>
        </Button>
      </div>

      {/* Vehicle Info */}
      {driver.vehicle_model && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Navigation className="h-5 w-5 mr-2" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Model:</span>
              <span className="text-white">{driver.vehicle_model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Color:</span>
              <span className="text-white">{driver.vehicle_color || 'White'}</span>
            </div>
            {driver.plate_number && (
              <div className="flex justify-between">
                <span className="text-gray-400">Plate:</span>
                <span className="text-white">{driver.plate_number}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
