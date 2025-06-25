
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, AlertTriangle, Navigation } from 'lucide-react';

const ActiveTrip = () => {
  const [tripStatus, setTripStatus] = useState<'pickup' | 'enroute' | 'arrived'>('pickup');
  const navigate = useNavigate();

  const tripDetails = {
    passenger: 'Sarah Tekle',
    phone: '+251911987654',
    pickup: 'Bole Atlas Hotel',
    dropoff: 'Addis Ababa University',
    fare: '180.00'
  };

  const handleStartTrip = () => {
    setTripStatus('enroute');
  };

  const handleEndTrip = () => {
    navigate('/trip-summary');
  };

  const handleSOS = () => {
    navigate('/sos');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 space-y-4">
      {/* SOS Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSOS}
          size="sm"
          className="bg-red-600 hover:bg-red-700"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          SOS
        </Button>
      </div>

      {/* Map Placeholder */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Navigation className="h-12 w-12 mx-auto mb-2" />
              <div>GPS Navigation</div>
              <div className="text-sm">Live route to destination</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Status */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
              tripStatus === 'pickup' ? 'bg-yellow-600' :
              tripStatus === 'enroute' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              {tripStatus === 'pickup' ? 'Going to Pickup' :
               tripStatus === 'enroute' ? 'Trip in Progress' : 'Arrived at Destination'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{tripDetails.pickup}</div>
                <div className="text-gray-400 text-sm">Pickup Location</div>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-gray-600 h-8"></div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-medium">{tripDetails.dropoff}</div>
                <div className="text-gray-400 text-sm">Destination</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Passenger Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold text-lg">{tripDetails.passenger}</div>
              <div className="text-gray-400">{tripDetails.phone}</div>
              <div className="text-green-400 font-semibold">{tripDetails.fare} ETB</div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {tripStatus === 'pickup' && (
          <Button
            onClick={handleStartTrip}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-semibold"
          >
            Start Trip
          </Button>
        )}

        {tripStatus === 'enroute' && (
          <Button
            onClick={() => setTripStatus('arrived')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
          >
            Arrived at Destination
          </Button>
        )}

        {tripStatus === 'arrived' && (
          <Button
            onClick={handleEndTrip}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-lg font-semibold"
          >
            End Trip
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full border-gray-600 text-white hover:bg-gray-700"
        >
          Navigate with Google Maps
        </Button>
      </div>
    </div>
  );
};

export default ActiveTrip;
