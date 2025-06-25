
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Car, Phone, Mail, FileText, Star } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

const Profile = () => {
  const { driver, signOut, loading } = useDriverAuth();

  if (loading) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px]">
        <div className="text-white">Driver profile not found</div>
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

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarFallback className="bg-green-600 text-white text-2xl">
            {driver.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-white">{driver.name}</h1>
        <Badge className={`mt-2 ${
          driver.approved_status === 'approved' ? 'bg-green-600' : 
          driver.approved_status === 'pending' ? 'bg-yellow-600' : 
          'bg-red-600'
        } text-white`}>
          {driver.approved_status === 'approved' ? 'Active Driver' : 
           driver.approved_status === 'pending' ? 'Pending Approval' : 
           'Approval Rejected'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
              <Star className="h-6 w-6 mr-1" />
              {driverStats.rating}
            </div>
            <div className="text-sm text-gray-400">Rating</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{driverStats.totalTrips}</div>
            <div className="text-sm text-gray-400">Total Trips</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{driverStats.completionRate}%</div>
            <div className="text-sm text-gray-400">Completion</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="text-white">{driver.phone}</span>
          </div>
          {driver.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-white">{driver.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Car className="h-5 w-5 mr-2" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {driver.vehicle_model && (
            <div>
              <span className="text-gray-400">Model: </span>
              <span className="text-white">{driver.vehicle_model}</span>
            </div>
          )}
          {driver.plate_number && (
            <div>
              <span className="text-gray-400">Plate Number: </span>
              <span className="text-white">{driver.plate_number}</span>
            </div>
          )}
          {driver.vehicle_color && (
            <div>
              <span className="text-gray-400">Color: </span>
              <span className="text-white">{driver.vehicle_color}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white">Driver's License</span>
            <Badge className={driver.license_number ? "bg-green-600" : "bg-yellow-600"}>
              {driver.license_number ? "Verified" : "Pending"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Vehicle Registration</span>
            <Badge className={driver.approved_status === 'approved' ? "bg-green-600" : "bg-yellow-600"}>
              {driver.approved_status === 'approved' ? "Verified" : "Pending"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Insurance</span>
            <Badge className={driver.approved_status === 'approved' ? "bg-green-600" : "bg-yellow-600"}>
              {driver.approved_status === 'approved' ? "Verified" : "Pending"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
          Update Documents
        </Button>
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
