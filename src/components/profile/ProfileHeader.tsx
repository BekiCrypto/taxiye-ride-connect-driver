
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, FileText, Award } from 'lucide-react';
import { Driver } from '@/types/driver';

interface ProfileHeaderProps {
  driver: Driver;
}

const ProfileHeader = ({ driver }: ProfileHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600 text-white';
      case 'pending': return 'bg-yellow-600 text-white';
      case 'rejected': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Shield className="h-4 w-4" />;
      case 'pending': return <FileText className="h-4 w-4" />;
      case 'rejected': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
      <Card className="relative bg-gray-800/90 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 mx-auto border-4 border-green-400/20">
              <AvatarFallback className="bg-gradient-to-br from-green-600 to-blue-600 text-white text-2xl font-bold">
                {driver.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <div className={`w-8 h-8 rounded-full border-4 border-gray-800 flex items-center justify-center ${
                driver.approved_status === 'approved' ? 'bg-green-500' : 
                driver.approved_status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {getStatusIcon(driver.approved_status)}
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">{driver.name}</h1>
          <Badge className={`${getStatusColor(driver.approved_status)} px-4 py-1 text-sm font-medium`}>
            {driver.approved_status === 'approved' ? '✓ Verified Driver' : 
             driver.approved_status === 'pending' ? '⏳ Pending Approval' : 
             '❌ Approval Rejected'}
          </Badge>
          
          {driver.approved_status === 'approved' && (
            <div className="flex items-center justify-center mt-3 text-green-400">
              <Award className="h-4 w-4 mr-2" />
              <span className="text-sm">Active Professional Driver</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileHeader;
