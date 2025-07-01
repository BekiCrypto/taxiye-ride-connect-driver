
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';
import { useComplianceData } from '@/hooks/useComplianceData';
import ComplianceStatsCards from './compliance/ComplianceStatsCards';
import ComplianceFilters from './compliance/ComplianceFilters';
import DriversTable from './compliance/DriversTable';
import ExpiryNotificationsTable from './compliance/ExpiryNotificationsTable';
import AuditLogsTable from './compliance/AuditLogsTable';

const ComplianceAdminDashboard = () => {
  const { 
    drivers, 
    expiryNotifications, 
    auditLogs, 
    loading, 
    exportToCSV 
  } = useComplianceData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = !searchTerm || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.plate_number?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || driver.approved_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Compliance Admin Dashboard</h1>
          <Button onClick={() => exportToCSV(filteredDrivers)} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <ComplianceStatsCards drivers={drivers} expiryNotifications={expiryNotifications} />

        {/* Main Content */}
        <Tabs defaultValue="drivers" className="space-y-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="drivers">Driver Management</TabsTrigger>
            <TabsTrigger value="expiry">Document Expiry</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-4">
            <ComplianceFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
            <DriversTable drivers={filteredDrivers} />
          </TabsContent>

          <TabsContent value="expiry" className="space-y-4">
            <ExpiryNotificationsTable expiryNotifications={expiryNotifications} />
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <AuditLogsTable auditLogs={auditLogs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceAdminDashboard;
