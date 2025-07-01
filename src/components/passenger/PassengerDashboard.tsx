
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Car, Phone, CreditCard, History, User } from 'lucide-react';

const PassengerDashboard = () => {
  const [activeRide, setActiveRide] = useState(null);
  
  // Mock data - would come from API
  const passengerData = {
    name: "John Doe",
    rating: 4.8,
    totalRides: 45,
    savedAddresses: [
      { id: 1, name: "Home", address: "Bole, Addis Ababa" },
      { id: 2, name: "Work", address: "CMC, Addis Ababa" }
    ]
  };

  const recentRides = [
    {
      id: 1,
      date: "2024-01-15",
      from: "Bole Airport",
      to: "Piazza",
      fare: 150,
      driver: "Ahmed Hassan",
      rating: 5
    },
    {
      id: 2,
      date: "2024-01-14",
      from: "CMC",
      to: "Merkato",
      fare: 85,
      driver: "Sarah Bekele",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hello, {passengerData.name}! 👋</h1>
          <p className="text-gray-400">Where would you like to go?</p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">{passengerData.rating}</span>
          </div>
          <p className="text-xs text-gray-400">{passengerData.totalRides} rides</p>
        </div>
      </div>

      {/* Quick Book Section */}
      <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/50 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Car className="h-6 w-6 mr-2 text-green-400" />
            Book a Ride
          </h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <MapPin className="h-5 w-5 text-green-400" />
              <input
                type="text"
                placeholder="Where are you?"
                className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none"
              />
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <MapPin className="h-5 w-5 text-red-400" />
              <input
                type="text"
                placeholder="Where to?"
                className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none"
              />
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Find Driver
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Addresses */}
      <Card className="bg-gray-800/60 border-gray-700/50 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Saved Places
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {passengerData.savedAddresses.map((address) => (
              <div key={address.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">{address.name}</div>
                  <div className="text-gray-400 text-sm">{address.address}</div>
                </div>
                <Button size="sm" variant="outline" className="border-gray-600 text-white">
                  Go Here
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Rides */}
      <Card className="bg-gray-800/60 border-gray-700/50 mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="h-5 w-5 mr-2" />
            Recent Rides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRides.map((ride) => (
              <div key={ride.id} className="p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-400">{ride.date}</div>
                  <Badge className="bg-green-600/20 text-green-400">
                    {ride.fare} ETB
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white text-sm">{ride.from}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-white text-sm">{ride.to}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-gray-400 text-sm">Driver: {ride.driver}</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < ride.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-16 border-gray-600 text-white hover:bg-gray-700/60 flex-col"
        >
          <CreditCard className="h-6 w-6 mb-1" />
          <span className="text-sm">Payment</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 border-gray-600 text-white hover:bg-gray-700/60 flex-col"
        >
          <Phone className="h-6 w-6 mb-1" />
          <span className="text-sm">Support</span>
        </Button>
      </div>
    </div>
  );
};

export default PassengerDashboard;
