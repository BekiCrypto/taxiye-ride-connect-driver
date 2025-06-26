
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

interface StatusAlertProps {
  onNavigate: (page: string) => void;
}

const StatusAlert = ({ onNavigate }: StatusAlertProps) => {
  const { driver } = useDriverAuth();

  if (!driver || driver.approved_status === 'approved') return null;

  return (
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
  );
};

export default StatusAlert;
