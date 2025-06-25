
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Car, Phone, CheckCircle } from 'lucide-react';

interface User {
  name: string;
  phone: string;
  vehicleModel: string;
  plateNumber: string;
}

interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => {
  const driverStats = {
    totalTrips: 1247,
    rating: 4.9,
    completionRate: 98,
    experience: '2 years'
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Profile Header */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {user.phone}
              </p>
              <Badge className="mt-2 bg-green-600 hover:bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Driver
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{driverStats.totalTrips}</div>
            <div className="text-sm text-gray-400">Total Trips</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">★ {driverStats.rating}</div>
            <div className="text-sm text-gray-400">Rating</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{driverStats.completionRate}%</div>
            <div className="text-sm text-gray-400">Completion</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{driverStats.experience}</div>
            <div className="text-sm text-gray-400">Experience</div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Information */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Car className="h-5 w-5 mr-2" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Model</span>
            <span className="text-white font-medium">{user.vehicleModel}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Plate Number</span>
            <span className="text-white font-medium">{user.plateNumber}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-400">Color</span>
            <span className="text-white font-medium">White</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400">Year</span>
            <span className="text-white font-medium">2020</span>
          </div>
        </CardContent>
      </Card>

      {/* Documents Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Document Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Driver License', status: 'Approved' },
            { name: 'National ID', status: 'Approved' },
            { name: 'Vehicle Registration', status: 'Approved' },
            { name: 'Insurance Certificate', status: 'Approved' }
          ].map((doc) => (
            <div key={doc.name} className="flex justify-between items-center py-2">
              <span className="text-gray-400">{doc.name}</span>
              <Badge className="bg-green-600 hover:bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                {doc.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Update Profile
        </Button>
        <Button className="w-full bg-orange-600 hover:bg-orange-700">
          Update Vehicle Info
        </Button>
        <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-700">
          View Documents
        </Button>
      </div>
    </div>
  );
};

export default Profile;
