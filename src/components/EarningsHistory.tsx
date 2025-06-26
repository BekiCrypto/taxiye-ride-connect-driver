
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Download, DollarSign, TrendingUp, Car } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useRides } from '@/hooks/useRides';

const EarningsHistory = () => {
  const { driver } = useDriverAuth();
  const { rides, loading } = useRides();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const completedRides = rides.filter(ride => ride.status === 'completed');

  const getFilteredRides = (period: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    const startOfPeriod = new Date();

    switch (period) {
      case 'daily':
        startOfPeriod.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startOfPeriod.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startOfPeriod.setMonth(now.getMonth() - 1);
        break;
    }

    return completedRides.filter(ride => 
      ride.completed_at && new Date(ride.completed_at) >= startOfPeriod
    );
  };

  const filteredRides = getFilteredRides(selectedPeriod);

  const stats = {
    totalTrips: filteredRides.length,
    totalEarnings: filteredRides.reduce((sum, ride) => sum + (ride.fare || 0), 0),
    totalCommission: filteredRides.reduce((sum, ride) => sum + (ride.commission || 0), 0),
    netEarnings: filteredRides.reduce((sum, ride) => sum + (ride.net_earnings || 0), 0),
    averageRating: 4.8, // This would come from a ratings table
    totalDistance: filteredRides.reduce((sum, ride) => sum + (ride.distance_km || 0), 0)
  };

  const generateReport = () => {
    const reportData = {
      period: selectedPeriod,
      driver: driver?.name,
      phone: driver?.phone,
      ...stats,
      rides: filteredRides.map(ride => ({
        date: ride.completed_at,
        pickup: ride.pickup_location,
        dropoff: ride.dropoff_location,
        distance: ride.distance_km,
        fare: ride.fare,
        commission: ride.commission,
        net: ride.net_earnings
      }))
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `earnings-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading earnings history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Earnings History</h1>
        <Button
          onClick={generateReport}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="daily" className="text-white">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="text-white">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="text-white">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-green-100 text-sm">Net Earnings</div>
                    <div className="text-2xl font-bold text-white">
                      {stats.netEarnings.toFixed(2)} ETB
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-800 to-blue-600 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-100 text-sm">Total Trips</div>
                    <div className="text-2xl font-bold text-white">{stats.totalTrips}</div>
                  </div>
                  <Car className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-gray-400 text-sm">Gross Earnings</div>
                <div className="text-xl font-bold text-white">
                  {stats.totalEarnings.toFixed(2)} ETB
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-gray-400 text-sm">Commission</div>
                <div className="text-xl font-bold text-red-400">
                  -{stats.totalCommission.toFixed(2)} ETB
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-gray-400 text-sm">Average Rating</div>
                <div className="text-lg font-bold text-yellow-400">
                  ⭐ {stats.averageRating}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="text-gray-400 text-sm">Distance Covered</div>
                <div className="text-lg font-bold text-white">
                  {stats.totalDistance.toFixed(1)} km
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trip Details */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredRides.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No trips found for the selected period
                </div>
              ) : (
                filteredRides.map((ride) => (
                  <div key={ride.id} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {ride.pickup_location} → {ride.dropoff_location}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {ride.completed_at && new Date(ride.completed_at).toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {ride.distance_km} km • {ride.passenger_name || 'Passenger'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">
                          +{ride.net_earnings?.toFixed(2)} ETB
                        </div>
                        <div className="text-gray-400 text-sm">
                          Gross: {ride.fare?.toFixed(2)} ETB
                        </div>
                        <div className="text-red-400 text-sm">
                          Commission: -{ride.commission?.toFixed(2)} ETB
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        ride.status === 'completed' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {ride.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsHistory;
