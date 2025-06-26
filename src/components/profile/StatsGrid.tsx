
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const StatsGrid = () => {
  const driverStats = {
    rating: 4.8,
    totalTrips: 247,
    completionRate: 96
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-700/50 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-yellow-400 mr-1" />
            <div className="text-2xl font-bold text-yellow-400">{driverStats.rating}</div>
          </div>
          <div className="text-sm text-yellow-300 font-medium">Rating</div>
          <div className="text-xs text-gray-400 mt-1">Excellent service</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">{driverStats.totalTrips}</div>
          <div className="text-sm text-blue-300 font-medium">Total Trips</div>
          <div className="text-xs text-gray-400 mt-1">Career rides</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">{driverStats.completionRate}%</div>
          <div className="text-sm text-green-300 font-medium">Completion</div>
          <div className="text-xs text-gray-400 mt-1">Success rate</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;
