
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const RideRequest = () => {
  const [countdown, setCountdown] = useState(15);
  const navigate = useNavigate();

  const rideDetails = {
    pickupLocation: 'Bole Atlas, Addis Ababa',
    dropoffLocation: 'Piazza, Addis Ababa',
    distance: '5.2 km',
    estimatedFare: '125.50 ETB',
    passengerName: 'Sarah Tadesse',
    passengerRating: 4.8
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/'); // Auto-decline when timer runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleAccept = () => {
    navigate('/active-trip');
  };

  const handleDecline = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardContent className="p-6 space-y-6">
          {/* Timer */}
          <div className="text-center">
            <div className="text-6xl font-bold text-orange-400 mb-2">
              {countdown}
            </div>
            <div className="text-white">seconds to respond</div>
          </div>

          {/* Ride Details */}
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-3">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Pickup</div>
                  <div className="text-white font-medium">{rideDetails.pickupLocation}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Dropoff</div>
                  <div className="text-white font-medium">{rideDetails.dropoffLocation}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Distance</div>
                <div className="text-white font-medium">{rideDetails.distance}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <DollarSign className="h-5 w-5 text-green-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Estimated Fare</div>
                <div className="text-white font-medium">{rideDetails.estimatedFare}</div>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {rideDetails.passengerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">{rideDetails.passengerName}</div>
                  <div className="text-yellow-400 text-sm">
                    ★ {rideDetails.passengerRating} rating
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleDecline}
              variant="outline"
              className="h-14 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Decline
            </Button>
            <Button 
              onClick={handleAccept}
              className="h-14 bg-green-600 hover:bg-green-700"
            >
              Accept Ride
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideRequest;
