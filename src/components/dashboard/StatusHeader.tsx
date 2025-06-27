
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Wifi, WifiOff, Clock } from 'lucide-react';

const StatusHeader = () => {
  const { driver } = useDriverAuth();

  if (!driver) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Active Driver';
      case 'pending': return 'Pending Approval';
      case 'rejected': return 'Application Rejected';
      default: return 'Unknown Status';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(driver.approved_status)}`} />
            <div>
              <div className="text-white font-medium">
                {getStatusText(driver.approved_status)}
              </div>
              <div className="text-gray-400 text-sm">
                Driver ID: {driver.phone.replace('DRV_', '')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {driver.is_online ? (
                <>
                  <Wifi className="h-4 w-4 text-green-400" />
                  <Badge className="bg-green-600/20 text-green-400">Online</Badge>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-gray-400" />
                  <Badge className="bg-gray-600/20 text-gray-400">Offline</Badge>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusHeader;
