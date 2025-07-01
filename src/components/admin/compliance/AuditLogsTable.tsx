
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { ComplianceAuditLog } from '@/types/driver';

interface AuditLogsTableProps {
  auditLogs: ComplianceAuditLog[];
}

const AuditLogsTable = ({ auditLogs }: AuditLogsTableProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-400" />
          <span>Compliance Audit Trail</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Timestamp</TableHead>
              <TableHead className="text-gray-300">Driver</TableHead>
              <TableHead className="text-gray-300">Action</TableHead>
              <TableHead className="text-gray-300">Performed By</TableHead>
              <TableHead className="text-gray-300">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-gray-300">
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="text-white">{log.driver_phone_ref}</TableCell>
                <TableCell className="text-gray-300 capitalize">{log.action_type.replace('_', ' ')}</TableCell>
                <TableCell className="text-gray-300">{log.performed_by}</TableCell>
                <TableCell className="text-gray-300">
                  {JSON.stringify(log.action_details)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuditLogsTable;
