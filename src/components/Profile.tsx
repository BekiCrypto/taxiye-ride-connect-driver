
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Car, Phone, Mail, FileText, Star, Edit, LogOut, Shield, Award } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

const Profile = () => {
  const { driver, signOut, loading } = useDriverAuth();

  if (loading) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="text-white text-lg mb-2">Driver profile not found</div>
          <div className="text-gray-400">Please contact support for assistance</div>
        </div>
      </div>
    );
  }

  const driverStats = {
    rating: 4.8,
    totalTrips: 247,
    completionRate: 96
  };

  const handleLogout = async () => {
    await signOut();
  };

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
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      {/* Enhanced Profile Header */}
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

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-700/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-400 mr-1" />
              <div className="text-2xl font-bold text-yellow-400">{driverStats.rating}</div>
            </div>
            <div className="text-sm text-yellow-300 font-medium">Rating</div>
            <div className="text-xs text-gray-400 mt-1">Excellent service</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">{driverStats.totalTrips}</div>
            <div className="text-sm text-blue-300 font-medium">Total Trips</div>
            <div className="text-xs text-gray-400 mt-1">Career rides</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">{driverStats.completionRate}%</div>
            <div className="text-sm text-green-300 font-medium">Completion</div>
            <div className="text-xs text-gray-400 mt-1">Success rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Personal Information */}
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

      {/* Enhanced Vehicle Information */}
      <Card className="bg-gray-800/60 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center text-lg">
            <div className="p-2 bg-purple-600/20 rounded-lg mr-3">
              <Car className="h-5 w-5 text-purple-400" />
            </div>
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driver.vehicle_model && (
              <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">Model</div>
                  <div className="text-white font-medium">{driver.vehicle_model}</div>
                </div>
              </div>
            )}
            
            {driver.plate_number && (
              <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">Plate Number</div>
                  <Badge className="bg-gray-700 text-white font-mono text-sm mt-1">
                    {driver.plate_number}
                  </Badge>
                </div>
              </div>
            )}
            
            {driver.vehicle_color && (
              <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-400">Color</div>
                  <div className="text-white font-medium">{driver.vehicle_color}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between py-3 px-4 bg-gray-700/30 rounded-lg">
              <div>
                <div className="text-sm text-gray-400">Vehicle Status</div>
                <Badge className="bg-green-600/20 text-green-400 mt-1">Active & Ready</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Documents Section */}
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

      {/* Enhanced Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full h-12 border-gray-600 text-white hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-300"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Profile</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full h-12 border-gray-600 text-white hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-300"
        >
          <FileText className="h-5 w-5" />
          <span>Update Documents</span>
        </Button>
        
        <Button 
          variant="destructive" 
          className="w-full h-12 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-300" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Profile;
