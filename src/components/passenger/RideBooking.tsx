
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Car, Phone, Star, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RideBooking = () => {
  const [bookingStep, setBookingStep] = useState<'search' | 'selecting' | 'confirmed' | 'active'>('search');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // Mock data - would come from API
  const availableDrivers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      rating: 4.8,
      vehicle: "Toyota Corolla",
      plateNumber: "AA-123-456",
      estimatedArrival: "5 min",
      fare: 120,
      distance: "2.3 km"
    },
    {
      id: 2,
      name: "Sarah Bekele",
      rating: 4.9,
      vehicle: "Nissan Sunny",
      plateNumber: "AA-789-012",
      estimatedArrival: "8 min",
      fare: 115,
      distance: "1.8 km"
    },
    {
      id: 3,
      name: "Daniel Tesfaye",
      rating: 4.7,
      vehicle: "Hyundai Elantra",
      plateNumber: "AA-345-678",
      estimatedArrival: "12 min",
      fare: 125,
      distance: "3.1 km"
    }
  ];

  const handleSearch = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup and dropoff locations",
        variant: "destructive"
      });
      return;
    }
    setBookingStep('selecting');
  };

  const handleSelectDriver = (driver: any) => {
    setSelectedDriver(driver);
    setBookingStep('confirmed');
    toast({
      title: "Driver Selected! 🚗",
      description: `${driver.name} will pick you up in ${driver.estimatedArrival}`
    });
  };

  const handleConfirmBooking = () => {
    setBookingStep('active');
    toast({
      title: "Ride Confirmed! ✅",
      description: "Your driver is on the way"
    });
  };

  if (bookingStep === 'search') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Book a Ride</h1>
            <p className="text-gray-400">Where would you like to go?</p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <Input
                    type="text"
                    placeholder="Pickup location"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                  />
                  <Button size="sm" variant="ghost">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-700/50 rounded-lg">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <Input
                    type="text"
                    placeholder="Where to?"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSearch}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                Find Available Drivers
              </Button>
            </CardContent>
          </Card>

          {/* Quick Destinations */}
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {['Airport', 'Merkato', 'Piazza', 'Bole'].map((place) => (
                  <Button
                    key={place}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                    onClick={() => setDropoffLocation(place)}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {place}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (bookingStep === 'selecting') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Available Drivers</h1>
            <p className="text-gray-400">Choose your preferred driver</p>
          </div>

          <div className="space-y-4">
            {availableDrivers.map((driver) => (
              <Card key={driver.id} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{driver.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{driver.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-sm">{driver.rating}</span>
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm">{driver.vehicle} • {driver.plateNumber}</div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-green-400" />
                            <span className="text-green-400 text-sm">{driver.estimatedArrival}</span>
                          </div>
                          <div className="text-gray-400 text-sm">{driver.distance}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">{driver.fare} ETB</div>
                      <Button
                        onClick={() => handleSelectDriver(driver)}
                        className="bg-green-600 hover:bg-green-700 text-white mt-2"
                        size="sm"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bookingStep === 'confirmed' && selectedDriver) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Ride Confirmed</h1>
            <p className="text-gray-400">Your driver is coming to pick you up</p>
          </div>

          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{selectedDriver.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-lg">{selectedDriver.name}</div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-yellow-400">{selectedDriver.rating}</span>
                    </div>
                    <div className="text-gray-400">{selectedDriver.vehicle}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-400"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Plate Number</span>
                  <span className="text-white font-medium">{selectedDriver.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Estimated Arrival</span>
                  <Badge className="bg-green-600/20 text-green-400">{selectedDriver.estimatedArrival}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Fare</span>
                  <span className="text-white font-bold">{selectedDriver.fare} ETB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-gray-400 text-sm">Pickup</div>
                  <div className="text-white">{pickupLocation}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div>
                  <div className="text-gray-400 text-sm">Destination</div>
                  <div className="text-white">{dropoffLocation}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600/10"
              onClick={() => setBookingStep('search')}
            >
              Cancel Ride
            </Button>
            <Button
              onClick={handleConfirmBooking}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Trip
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RideBooking;
