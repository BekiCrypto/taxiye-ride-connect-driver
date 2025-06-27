
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

const VehicleInfo = () => {
  const { driver } = useDriverAuth();

  if (!driver || !driver.vehicle_model) return null;

  return (
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
  );
};

export default VehicleInfo;
