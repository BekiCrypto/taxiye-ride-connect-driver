
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Car, DollarSign, Clock, Navigation, Bell, HelpCircle, TrendingUp, MapPin } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useRides } from '@/hooks/useRides';
import { toast } from '@/hooks/use-toast';

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
        title: checked ? "You're now online! 🚗" : "You're now offline",
        description: checked ? "Ready to receive ride requests" : "You won't receive ride requests",
      });
    }
  };

  // Calculate today's stats
  const today = new Date().toDateString();
  const todayRides = rides.filter(ride => 
    new Date(ride.created_at).toDateString() === today && ride.status === 'completed'
  );
  const todayEarnings = todayRides.reduce((sum, ride) => sum + (ride.net_earnings || 0), 0);
  const weeklyRides = rides.filter(ride => {
    const rideDate = new Date(ride.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return rideDate >= weekAgo && ride.status === 'completed';
  });

  if (!driver) return null;

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      {/* Enhanced Header with Status Indicator */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
        <Card className="relative bg-gray-800/90 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h1>
                <p className="text-gray-300 text-lg">{driver.name}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Status</div>
                  <Badge className={`${driver.is_online ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}>
                    {driver.is_online ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <Switch
                  checked={driver.is_online}
                  onCheckedChange={handleOnlineToggle}
                  className="data-[state=checked]:bg-green-600"
                />
                <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  driver.is_online ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-500'
                }`} />
              </div>
            </div>
            
            {driver.is_online && (
              <div className="flex items-center space-x-2 text-green-400 animate-pulse">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Ready to receive ride requests</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Alert - Enhanced */}
      {driver.approved_status !== 'approved' && (
        <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-700/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-600/20 rounded-full">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <div className="text-yellow-100 font-medium">
                  Account Status: {driver.approved_status.toUpperCase()}
                </div>
                <div className="text-yellow-200 text-sm">
                  {driver.approved_status === 'pending' 
                    ? 'Your documents are being reviewed. You\'ll be notified once approved.'
                    : 'Please update your documents to continue driving.'
                  }
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
                onClick={() => onNavigate('profile')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-green-900/20 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {todayEarnings.toFixed(2)} ETB
            </div>
            <div className="text-green-400 text-sm font-medium">Today's Earnings</div>
            <div className="text-xs text-gray-400 mt-1">
              +{((todayEarnings / (driver.wallet_balance || 1)) * 100).toFixed(1)}% of wallet
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Car className="h-6 w-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-600/20 text-blue-400 text-xs">Today</Badge>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{todayRides.length}</div>
            <div className="text-blue-400 text-sm font-medium">Trips Completed</div>
            <div className="text-xs text-gray-400 mt-1">
              {weeklyRides.length} this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Wallet Balance */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-600/20 rounded-xl">
                <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white mb-1">Wallet Balance</div>
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  {driver.wallet_balance.toFixed(2)} ETB
                </div>
                <div className="text-xs text-gray-400 mt-1">Available for withdrawal</div>
              </div>
            </div>
            <Button 
              onClick={() => onNavigate('wallet')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-900/25"
            >
              Manage Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => onNavigate('notifications')}
            className="w-full h-14 bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-between px-6 transition-all duration-300 hover:shadow-lg"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Bell className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-white font-medium">Notifications</div>
                <div className="text-xs text-gray-400">Check latest updates</div>
              </div>
            </div>
            <Badge className="bg-blue-600/20 text-blue-400">3</Badge>
          </Button>

          <Button
            onClick={() => onNavigate('support')}
            className="w-full h-14 bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-start space-x-3 px-6 transition-all duration-300 hover:shadow-lg"
            variant="outline"
          >
            <div className="p-2 bg-green-600/20 rounded-lg">
              <HelpCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-left">
              <div className="text-white font-medium">Help & Support</div>
              <div className="text-xs text-gray-400">Get assistance 24/7</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced Vehicle Info */}
      {driver.vehicle_model && (
        <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <div className="p-2 bg-gray-700/50 rounded-lg mr-3">
                <Navigation className="h-5 w-5 text-gray-300" />
              </div>
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Model</span>
                  <span className="text-white font-medium">{driver.vehicle_model}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Color</span>
                  <span className="text-white font-medium">{driver.vehicle_color || 'White'}</span>
                </div>
              </div>
              <div className="space-y-2">
                {driver.plate_number && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400 text-sm">Plate</span>
                    <Badge className="bg-gray-700 text-white font-mono">
                      {driver.plate_number}
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Status</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
