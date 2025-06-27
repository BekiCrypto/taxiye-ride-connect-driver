
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Car, Palette, Hash } from 'lucide-react';

const VehicleInfo = () => {
  const { driver } = useDriverAuth();

  if (!driver || driver.approved_status !== 'approved') return null;

  const hasVehicleInfo = driver.vehicle_model || driver.vehicle_color || driver.plate_number;

  if (!hasVehicleInfo) return null;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Car className="h-5 w-5" />
          <span>Vehicle Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {driver.vehicle_model && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <Car className="h-4 w-4" />
              <span>Model</span>
            </div>
            <Badge variant="secondary" className="bg-gray-700 text-white">
              {driver.vehicle_model}
            </Badge>
          </div>
        )}
        
        {driver.vehicle_color && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <Palette className="h-4 w-4" />
              <span>Color</span>
            </div>
            <Badge variant="secondary" className="bg-gray-700 text-white">
              {driver.vehicle_color}
            </Badge>
          </div>
        )}
        
        {driver.plate_number && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <Hash className="h-4 w-4" />
              <span>Plate</span>
            </div>
            <Badge variant="secondary" className="bg-gray-700 text-white font-mono">
              {driver.plate_number}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleInfo;
