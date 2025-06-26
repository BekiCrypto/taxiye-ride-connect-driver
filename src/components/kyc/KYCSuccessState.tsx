
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, LogOut } from 'lucide-react';

interface KYCSuccessStateProps {
  onApproval: () => void;
  onSignOut: () => void;
}

const KYCSuccessState = ({ onApproval, onSignOut }: KYCSuccessStateProps) => {
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
          <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">You're All Set! 🎉</CardTitle>
          <p className="text-gray-400">Your documents have been approved and you can now start driving.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onApproval}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button
            onClick={onSignOut}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCSuccessState;
