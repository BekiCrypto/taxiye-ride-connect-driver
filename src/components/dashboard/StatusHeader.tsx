
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDriverAuth } from '@/hooks/useDriverAuth';

const StatusHeader = () => {
  const { driver, updateDriverProfile } = useDriverAuth();

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

  if (!driver) return null;

  return (
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
  );
};

export default StatusHeader;
