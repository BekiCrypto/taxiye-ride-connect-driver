
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, AlertTriangle } from 'lucide-react';
import { Driver, DocumentExpiryNotification } from '@/types/driver';

interface ComplianceStatsCardsProps {
  drivers: Driver[];
  expiryNotifications: DocumentExpiryNotification[];
}

const ComplianceStatsCards = ({ drivers, expiryNotifications }: ComplianceStatsCardsProps) => {
  const stats = {
    totalDrivers: drivers.length,
    pendingApplications: drivers.filter(d => d.approved_status === 'pending').length,
    approvedDrivers: drivers.filter(d => d.approved_status === 'approved').length,
    expiringDocuments: expiryNotifications.length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Drivers</p>
              <p className="text-white text-2xl font-bold">{stats.totalDrivers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Applications</p>
              <p className="text-white text-2xl font-bold">{stats.pendingApplications}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved Drivers</p>
              <p className="text-white text-2xl font-bold">{stats.approvedDrivers}</p>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Expiring Documents</p>
              <p className="text-white text-2xl font-bold">{stats.expiringDocuments}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceStatsCards;
