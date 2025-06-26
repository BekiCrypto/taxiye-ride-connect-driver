
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Car, Shield } from 'lucide-react';
import { Driver } from '@/types/driver';

interface DocumentsCardProps {
  driver: Driver;
}

const DocumentsCard = ({ driver }: DocumentsCardProps) => {
  return (
    <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-lg">
          <div className="p-2 bg-green-600/20 rounded-lg mr-3">
            <FileText className="h-5 w-5 text-green-400" />
          </div>
          Documents & Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-3 px-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-medium">Driver's License</div>
              <div className="text-xs text-gray-400">
                {driver.license_number ? `License: ${driver.license_number}` : 'License verification'}
              </div>
            </div>
          </div>
          <Badge className={driver.license_number ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
            {driver.license_number ? "✓ Verified" : "⏳ Pending"}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center py-3 px-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="text-white font-medium">Vehicle Registration</div>
              <div className="text-xs text-gray-400">Vehicle documentation</div>
            </div>
          </div>
          <Badge className={driver.approved_status === 'approved' ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
            {driver.approved_status === 'approved' ? "✓ Verified" : "⏳ Pending"}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center py-3 px-4 bg-gray-700/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="text-white font-medium">Insurance</div>
              <div className="text-xs text-gray-400">Vehicle insurance coverage</div>
            </div>
          </div>
          <Badge className={driver.approved_status === 'approved' ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"}>
            {driver.approved_status === 'approved' ? "✓ Verified" : "⏳ Pending"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
