
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car } from 'lucide-react';
import { Driver } from '@/types/driver';

interface VehicleInfoCardProps {
  driver: Driver;
}

const VehicleInfoCard = ({ driver }: VehicleInfoCardProps) => {
  return (
    <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg">
          <div className="p-2 bg-purple-600/20 rounded-lg mr-3">
            <Car className="h-5 w-5 text-purple-400" />
          </div>
          Vehicle Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {driver.vehicle_model && (
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
              <div>
                <div className="text-sm text-gray-400">Model</div>
                <div className="text-white font-medium">{driver.vehicle_model}</div>
              </div>
            </div>
          )}
          
          {driver.plate_number && (
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
              <div>
                <div className="text-sm text-gray-400">Plate Number</div>
                <Badge className="bg-gray-700 text-white font-mono text-sm mt-1">
                  {driver.plate_number}
                </Badge>
              </div>
            </div>
          )}
          
          {driver.vehicle_color && (
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
              <div>
                <div className="text-sm text-gray-400">Color</div>
                <div className="text-white font-medium">{driver.vehicle_color}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
            <div>
              <div className="text-sm text-gray-400">Vehicle Status</div>
              <Badge className="bg-green-600/20 text-green-400 mt-1">Active & Ready</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInfoCard;
