
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock } from 'lucide-react';
import { Driver } from '@/types/driver';

interface KYCStatusAlertProps {
  driver: Driver | null;
}

const KYCStatusAlert = ({ driver }: KYCStatusAlertProps) => {
  // Add null check to prevent runtime errors
  if (!driver || driver.approved_status !== 'pending' || !driver.admin_notes) {
    return null;
  }
  
  return (
    <Alert className="bg-yellow-900/50 border-yellow-700/50">
      <Clock className="h-4 w-4" />
      <AlertDescription className="text-yellow-200">
        <div className="font-medium mb-1">Status: Under Review</div>
        {driver.admin_notes}
      </AlertDescription>
    </Alert>
  );
};

export default KYCStatusAlert;
