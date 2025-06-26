
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface AdminLoginProps {
  onLogin: (isAdmin: boolean) => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!adminCode) {
      toast({
        title: "Missing Code",
        description: "Please enter the admin access code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simple admin code check - in production, this would be more secure
    if (adminCode === 'admin2024' || adminCode === 'review123') {
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin review panel",
      });
      onLogin(true);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct admin access code",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">A</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Admin Access
          </CardTitle>
          <p className="text-gray-400">
            Enter admin code to review components
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Access Code
            </label>
            <Input
              type="password"
              placeholder="Enter admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
          </div>

          <Button 
            onClick={handleAdminLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Access Admin Panel'}
          </Button>

          <div className="text-center border-t border-gray-600 pt-4">
            <div className="text-xs text-gray-400 mb-2">
              Demo Admin Codes:
            </div>
            <div className="text-xs text-gray-500">
              • admin2024
              • review123
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
