
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';

const RideRequest = () => {
  const [timeLeft, setTimeLeft] = useState(15);
  const navigate = useNavigate();

  const rideDetails = {
    passenger: 'Sarah Tekle',
    pickup: 'Bole Atlas Hotel',
    dropoff: 'Addis Ababa University',
    distance: '8.5 km',
    estimatedFare: '180.00',
    estimatedTime: '15 min'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          navigate('/');
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
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
            <div className="text-2xl font-bold text-white">{timeLeft}</div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">New Ride Request</CardTitle>
          <p className="text-gray-400">Accept or decline within {timeLeft} seconds</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-400" />
              <div>
                <div className="text-white font-medium">{rideDetails.passenger}</div>
                <div className="text-gray-400 text-sm">Passenger</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-white font-medium">{rideDetails.pickup}</div>
                <div className="text-gray-400 text-sm">Pickup Location</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-white font-medium">{rideDetails.dropoff}</div>
                <div className="text-gray-400 text-sm">Destination</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="text-lg font-bold text-white">{rideDetails.distance}</div>
              <div className="text-xs text-gray-400">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{rideDetails.estimatedTime}</div>
              <div className="text-xs text-gray-400">Est. Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{rideDetails.estimatedFare} ETB</div>
              <div className="text-xs text-gray-400">Fare</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleDecline}
              variant="destructive"
              className="h-12 bg-red-600 hover:bg-red-700"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="h-12 bg-green-600 hover:bg-green-700"
            >
              Accept
            </Button>
          </div>

          <div className="text-center">
            <div className="text-yellow-400 text-sm">
              <Clock className="h-4 w-4 inline mr-1" />
              Auto-decline in {timeLeft}s
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RideRequest;
