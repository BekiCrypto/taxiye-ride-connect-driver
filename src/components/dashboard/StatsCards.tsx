
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Car, TrendingUp } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useRides } from '@/hooks/useRides';

const StatsCards = () => {
  const { driver } = useDriverAuth();
  const { rides } = useRides();

  if (!driver) return null;

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

  return (
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
  );
};

export default StatsCards;
