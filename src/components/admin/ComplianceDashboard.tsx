
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Car,
  Phone,
  Eye,
  XCircle
} from 'lucide-react';

const ComplianceDashboard = () => {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // Mock data - would come from API
  const complianceStats = {
    totalDrivers: 1247,
    approvedDrivers: 1089,
    pendingDrivers: 123,
    rejectedDrivers: 35,
    expiringDocuments: 67,
    activeRides: 234
  };

  const pendingDrivers = [
    {
      id: 1,
      name: "Michael Johnson",
      phone: "+251911234567",
      registrationDate: "2024-01-15",
      documentsSubmitted: 8,
      totalDocuments: 8,
      status: "pending_review",
      priority: "high"
    },
    {
      id: 2,
      name: "Fatima Ali",
      phone: "+251922345678",
      registrationDate: "2024-01-14",
      documentsSubmitted: 7,
      totalDocuments: 8,
      status: "incomplete",
      priority: "medium"
    }
  ];

  const expiringDocuments = [
    {
      driverId: 1,
      driverName: "Ahmed Hassan",
      documentType: "License",
      expiryDate: "2024-02-15",
      daysUntilExpiry: 12,
      notificationsSent: 2
    },
    {
      driverId: 2,
      driverName: "Sarah Bekele",
      documentType: "Insurance",
      expiryDate: "2024-02-20",
      daysUntilExpiry: 17,
      notificationsSent: 1
    }
  ];

  const handleApproveDriver = (driverId: number) => {
    console.log(`Approving driver ${driverId}`);
    // Implementation would update database
  };

  const handleRejectDriver = (driverId: number, reason: string) => {
    console.log(`Rejecting driver ${driverId} - Reason: ${reason}`);
    // Implementation would update database
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Compliance Dashboard</h1>
            <p className="text-gray-400">ኤታስ' Directive Compliant Monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-600/20 text-green-400 px-3 py-1">
              System Compliant
            </Badge>
            <Badge className="bg-blue-600/20 text-blue-400 px-3 py-1">
              {complianceStats.activeRides} Active Rides
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Approved Drivers</p>
                  <p className="text-2xl font-bold text-white">{complianceStats.approvedDrivers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-medium">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{complianceStats.pendingDrivers}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-sm font-medium">Expiring Soon</p>
                  <p className="text-2xl font-bold text-white">{complianceStats.expiringDocuments}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-medium">Total Drivers</p>
                  <p className="text-2xl font-bold text-white">{complianceStats.totalDrivers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="pending" className="data-[state=active]:bg-gray-700">
              Pending Reviews ({complianceStats.pendingDrivers})
            </TabsTrigger>
            <TabsTrigger value="expiring" className="data-[state=active]:bg-gray-700">
              Expiring Documents ({complianceStats.expiringDocuments})
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-gray-700">
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Driver Applications Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDrivers.map((driver) => (
                    <div key={driver.id} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{driver.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{driver.name}</div>
                            <div className="text-gray-400 text-sm">{driver.phone}</div>
                            <div className="text-gray-400 text-sm">Applied: {driver.registrationDate}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-white font-medium">
                              {driver.documentsSubmitted}/{driver.totalDocuments}
                            </div>
                            <div className="text-gray-400 text-xs">Documents</div>
                          </div>
                          <Badge className={`${
                            driver.priority === 'high' 
                              ? 'bg-red-600/20 text-red-400' 
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {driver.priority}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-blue-600 text-blue-400">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveDriver(driver.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectDriver(driver.id, "Documentation incomplete")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiring">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Documents Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiringDocuments.map((doc) => (
                    <div key={`${doc.driverId}-${doc.documentType}`} className="p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-orange-600/20 rounded-lg">
                            <FileText className="h-6 w-6 text-orange-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{doc.driverName}</div>
                            <div className="text-gray-400">{doc.documentType} expires on {doc.expiryDate}</div>
                            <div className="text-orange-400 text-sm">{doc.daysUntilExpiry} days remaining</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-white font-medium">{doc.notificationsSent}</div>
                            <div className="text-gray-400 text-xs">Notifications</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-orange-600 text-orange-400">
                              Send Reminder
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Compliance Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Audit logs will be displayed here</p>
                  <p className="text-gray-500 text-sm">All compliance actions are automatically logged</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
