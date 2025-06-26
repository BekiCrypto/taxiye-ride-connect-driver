
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail } from 'lucide-react';
import { Driver } from '@/types/driver';

interface PersonalInfoCardProps {
  driver: Driver;
}

const PersonalInfoCard = ({ driver }: PersonalInfoCardProps) => {
  return (
    <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg">
          <div className="p-2 bg-blue-600/20 rounded-lg mr-3">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-white font-medium">{driver.phone}</div>
              <div className="text-xs text-gray-400">Primary contact</div>
            </div>
          </div>
          <Badge className="bg-green-600/20 text-green-400">Verified</Badge>
        </div>
        
        {driver.email && (
          <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-white font-medium">{driver.email}</div>
                <div className="text-xs text-gray-400">Email address</div>
              </div>
            </div>
            <Badge className="bg-blue-600/20 text-blue-400">Active</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
