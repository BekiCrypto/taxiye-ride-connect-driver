
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusAlertProps {
  onNavigate: (page: string) => void;
}

const StatusAlert = ({ onNavigate }: StatusAlertProps) => {
  const { driver } = useDriverAuth();

  if (!driver) return null;

  const getAlertConfig = () => {
    switch (driver.approved_status) {
      case 'pending':
        return {
          icon: Clock,
          variant: 'default' as const,
          title: 'Application Under Review',
          description: 'Your driver application is being reviewed. This typically takes 1-2 business days.',
          action: null
        };
      case 'rejected':
        return {
          icon: XCircle,
          variant: 'destructive' as const,
          title: 'Application Rejected',
          description: driver.rejection_reason || 'Your application was rejected. Please contact support for details.',
          action: (
            <Button 
              onClick={() => onNavigate('kyc')} 
              variant="outline" 
              size="sm"
              className="mt-2"
            >
              Resubmit Documents
            </Button>
          )
        };
      case 'approved':
        if (!driver.is_online) {
          return {
            icon: AlertTriangle,
            variant: 'default' as const,
            title: 'You\'re Currently Offline',
            description: 'Go online to start receiving ride requests and earning money.',
            action: (
              <Button 
                onClick={() => {/* Toggle online status */}} 
                size="sm"
                className="mt-2 bg-green-600 hover:bg-green-700"
              >
                Go Online
              </Button>
            )
          };
        }
        return null;
      default:
        return {
          icon: AlertTriangle,
          variant: 'default' as const,
          title: 'Complete Your Profile',
          description: 'Please complete your driver profile to start accepting rides.',
          action: (
            <Button 
              onClick={() => onNavigate('kyc')} 
              size="sm"
              className="mt-2"
            >
              Complete Profile
            </Button>
          )
        };
    }
  };

  const alertConfig = getAlertConfig();
  
  if (!alertConfig) return null;

  const Icon = alertConfig.icon;

  return (
    <Alert variant={alertConfig.variant} className="border-gray-700 bg-gray-800/50">
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium text-white mb-1">
          {alertConfig.title}
        </div>
        <div className="text-gray-300 text-sm">
          {alertConfig.description}
        </div>
        {alertConfig.action}
      </AlertDescription>
    </Alert>
  );
};

export default StatusAlert;
