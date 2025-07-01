
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Driver } from '@/types/driver';

interface DriversTableProps {
  drivers: Driver[];
}

const DriversTable = ({ drivers }: DriversTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config?.variant}>{config?.label || status}</Badge>;
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Registered Drivers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Vehicle</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Registration</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.phone}>
                <TableCell className="text-white">{driver.name}</TableCell>
                <TableCell className="text-gray-300">{driver.phone}</TableCell>
                <TableCell className="text-gray-300">
                  {driver.vehicle_make && driver.vehicle_model 
                    ? `${driver.vehicle_make} ${driver.vehicle_model} (${driver.plate_number})`
                    : 'Not provided'
                  }
                </TableCell>
                <TableCell>{getStatusBadge(driver.approved_status)}</TableCell>
                <TableCell>
                  <Badge variant={driver.is_registration_complete ? "default" : "secondary"}>
                    {driver.is_registration_complete ? "Complete" : "Incomplete"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DriversTable;
