
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, AlertTriangle } from 'lucide-react';

const ActiveTrip = () => {
  const [tripStatus, setTripStatus] = useState<'going_to_pickup' | 'arrived' | 'in_progress'>('going_to_pickup');
  const navigate = useNavigate();

  const tripDetails = {
    pickupLocation: 'Bole Atlas, Addis Ababa',
    dropoffLocation: 'Piazza, Addis Ababa',
    passengerName: 'Sarah Tadesse',
    passengerPhone: '+251911654321',
    estimatedFare: '125.50 ETB'
  };

  const handleStatusUpdate = () => {
    if (tripStatus === 'going_to_pickup') {
      setTripStatus('arrived');
    } else if (tripStatus === 'arrived') {
      setTripStatus('in_progress');
    } else {
      navigate('/trip-summary');
    }
  };

  const getStatusText = () => {
    switch (tripStatus) {
      case 'going_to_pickup': return 'Arrived at Pickup';
      case 'arrived': return 'Start Trip';
      case 'in_progress': return 'End Trip';
      default: return 'Update Status';
    }
  };

  const getStatusMessage = () => {
    switch (tripStatus) {
      case 'going_to_pickup': return 'Navigate to pickup location';
      case 'arrived': return 'Passenger is getting in the car';
      case 'in_progress': return 'Trip in progress - Navigate to destination';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* SOS Button */}
      <div className="fixed top-4 right-4 z-10">
        <Button
          onClick={() => navigate('/sos')}
          className="bg-red-600 hover:bg-red-700 rounded-full w-14 h-14 p-0"
        >
          <AlertTriangle className="h-6 w-6" />
        </Button>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-gray-700 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <MapPin className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg">Navigation Map</p>
            <p className="text-sm">Google Maps integration would go here</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="absolute top-4 left-4 right-16">
          <Card className="bg-gray-800/90 border-gray-700">
            <CardContent className="p-3">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                tripStatus === 'going_to_pickup' ? 'bg-orange-600 text-white' :
                tripStatus === 'arrived' ? 'bg-blue-600 text-white' :
                'bg-green-600 text-white'
              }`}>
                {getStatusMessage()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trip Info Panel */}
      <div className="bg-gray-800 p-4 space-y-4">
        {/* Route Info */}
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <div className="text-xs text-gray-400">Pickup</div>
                <div className="text-white font-medium">{tripDetails.pickupLocation}</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <div className="text-xs text-gray-400">Dropoff</div>
                <div className="text-white font-medium">{tripDetails.dropoffLocation}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Info */}
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {tripDetails.passengerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">{tripDetails.passengerName}</div>
                  <div className="text-gray-400 text-sm">Passenger</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 p-2">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 p-2">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline"
            className="h-14 border-gray-600 text-white hover:bg-gray-700"
          >
            Call Support
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            className="h-14 bg-green-600 hover:bg-green-700"
          >
            {getStatusText()}
          </Button>
        </div>

        {/* Fare Display */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{tripDetails.estimatedFare}</div>
          <div className="text-sm text-gray-400">Estimated Fare</div>
        </div>
      </div>
    </div>
  );
};

export default ActiveTrip;
