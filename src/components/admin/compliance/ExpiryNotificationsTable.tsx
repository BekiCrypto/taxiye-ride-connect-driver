
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle } from 'lucide-react';
import { DocumentExpiryNotification } from '@/types/driver';

interface ExpiryNotificationsTableProps {
  expiryNotifications: DocumentExpiryNotification[];
}

const ExpiryNotificationsTable = ({ expiryNotifications }: ExpiryNotificationsTableProps) => {
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysUntilExpiry <= 1) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (daysUntilExpiry <= 7) {
      return <Badge variant="secondary">Warning</Badge>;
    }
    return <Badge variant="default">Valid</Badge>;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span>Expiring Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Driver</TableHead>
              <TableHead className="text-gray-300">Document Type</TableHead>
              <TableHead className="text-gray-300">Expiry Date</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Days Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiryNotifications.map((notification) => {
              const expiryDate = new Date(notification.expiry_date);
              const today = new Date();
              const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <TableRow key={notification.id}>
                  <TableCell className="text-white">{notification.driver_phone_ref}</TableCell>
                  <TableCell className="text-gray-300 capitalize">{notification.document_type}</TableCell>
                  <TableCell className="text-gray-300">{notification.expiry_date}</TableCell>
                  <TableCell>{getExpiryStatus(notification.expiry_date)}</TableCell>
                  <TableCell className="text-gray-300">
                    {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpiryNotificationsTable;
