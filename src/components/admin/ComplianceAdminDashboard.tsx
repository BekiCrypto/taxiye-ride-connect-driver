
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Search, Filter, AlertTriangle, FileText, Users, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Driver, DocumentExpiryNotification, ComplianceAuditLog } from '@/types/driver';
import { toast } from '@/hooks/use-toast';

const ComplianceAdminDashboard = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [expiryNotifications, setExpiryNotifications] = useState<DocumentExpiryNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<ComplianceAuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('30'); // days

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDrivers(),
        fetchExpiryNotifications(),
        fetchAuditLogs()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drivers:', error);
      return;
    }

    setDrivers(data || []);
  };

  const fetchExpiryNotifications = async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + parseInt(expiryFilter));

    const { data, error } = await supabase
      .from('document_expiry_notifications')
      .select('*')
      .lte('expiry_date', cutoffDate.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) {
      console.error('Error fetching expiry notifications:', error);
      return;
    }

    setExpiryNotifications(data || []);
  };

  const fetchAuditLogs = async () => {
    const { data, error } = await supabase
      .from('compliance_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return;
    }

    setAuditLogs(data || []);
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = !searchTerm || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.plate_number?.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || driver.approved_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const csvData = filteredDrivers.map(driver => ({
      Name: driver.name,
      Phone: driver.phone,
      Email: driver.email || '',
      Gender: driver.gender || '',
      'Date of Birth': driver.date_of_birth || '',
      'License Number': driver.license_number || '',
      'License Expiry': driver.license_expiry_date || '',
      'Vehicle Make': driver.vehicle_make || '',
      'Vehicle Model': driver.vehicle_model || '',
      'Vehicle Year': driver.vehicle_year || '',
      'Plate Number': driver.plate_number || '',
      'Insurance Expiry': driver.insurance_expiry_date || '',
      'Roadworthiness Expiry': driver.roadworthiness_expiry_date || '',
      'Approval Status': driver.approved_status,
      'Registration Complete': driver.is_registration_complete ? 'Yes' : 'No',
      'Service Agreement Signed': driver.service_agreement_signed ? 'Yes' : 'No',
      'Created At': driver.created_at || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drivers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Driver data has been exported to CSV"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      approved: { label: 'Approved', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config?.variant}>{config?.label || status}</Badge>;
  };

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

  const stats = {
    totalDrivers: drivers.length,
    pendingApplications: drivers.filter(d => d.approved_status === 'pending').length,
    approvedDrivers: drivers.filter(d => d.approved_status === 'approved').length,
    expiringDocuments: expiryNotifications.length
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Compliance Admin Dashboard</h1>
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>

        {/* Stats Cards */}
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

        {/* Main Content */}
        <Tabs defaultValue="drivers" className="space-y-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="drivers">Driver Management</TabsTrigger>
            <TabsTrigger value="expiry">Document Expiry</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-4">
            {/* Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search drivers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Drivers Table */}
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
                    {filteredDrivers.map((driver) => (
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
          </TabsContent>

          <TabsContent value="expiry" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceAdminDashboard;
