
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, AlertTriangle } from 'lucide-react';

const TripSummary = () => {
  const navigate = useNavigate();

  const tripData = {
    passenger: 'Sarah Tekle',
    pickup: 'Bole Atlas Hotel',
    dropoff: 'Addis Ababa University',
    distance: '8.5 km',
    duration: '18 minutes',
    grossFare: 180.00,
    commission: 18.00,
    netEarnings: 162.00,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  const handleDone = () => {
    navigate('/');
  };

  const handleFlagTrip = () => {
    // Handle trip flagging for review
    console.log('Trip flagged for review');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 space-y-6">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <DollarSign className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Trip Completed!</h1>
        <p className="text-gray-400">Great job completing another ride</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Passenger</span>
            <span className="text-white">{tripData.passenger}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date & Time</span>
            <span className="text-white">{tripData.date} at {tripData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Distance</span>
            <span className="text-white">{tripData.distance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duration</span>
            <span className="text-white">{tripData.duration}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Route</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">{tripData.pickup}</span>
          </div>
          <div className="ml-4 border-l-2 border-gray-600 h-6"></div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">{tripData.dropoff}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
        <CardHeader>
          <CardTitle className="text-white">Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-green-100">Gross Fare</span>
            <span className="text-white font-semibold">{tripData.grossFare.toFixed(2)} ETB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-100">Commission (10%)</span>
            <span className="text-red-200">-{tripData.commission.toFixed(2)} ETB</span>
          </div>
          <div className="border-t border-green-400 pt-2">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Net Earnings</span>
              <span className="text-white font-bold text-xl">{tripData.netEarnings.toFixed(2)} ETB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-white mb-2">Rate this trip</div>
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-8 w-8 text-yellow-400 fill-current cursor-pointer hover:scale-110"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button
          onClick={handleDone}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-semibold"
        >
          Done
        </Button>
        
        <Button
          onClick={handleFlagTrip}
          variant="outline"
          className="w-full border-red-600 text-red-400 hover:bg-red-900"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Flag Trip for Review
        </Button>
      </div>
    </div>
  );
};

export default TripSummary;
