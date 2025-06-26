
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Driver {
  rejection_reason?: string;
  admin_notes?: string;
}

interface KYCRejectionStateProps {
  driver: Driver;
}

const KYCRejectionState = ({ driver }: KYCRejectionStateProps) => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <img 
              src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
              alt="Taxiye Logo" 
              className="h-12 w-auto mx-auto"
            />
          </div>
          <div className="mx-auto w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Documents Rejected</CardTitle>
          <p className="text-gray-400">Your documents need to be corrected and resubmitted.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-red-900/50 border-red-700/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              <div className="font-medium mb-2">Rejection Reason:</div>
              {driver.rejection_reason}
            </AlertDescription>
          </Alert>

          {driver.admin_notes && (
            <Alert className="bg-blue-900/50 border-blue-700/50">
              <AlertDescription className="text-blue-200">
                <div className="font-medium mb-2">Admin Notes:</div>
                {driver.admin_notes}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Upload New Documents
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCRejectionState;
