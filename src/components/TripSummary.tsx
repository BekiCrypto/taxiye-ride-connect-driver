
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, DollarSign } from 'lucide-react';

const TripSummary = () => {
  const navigate = useNavigate();

  const tripData = {
    fare: 125.50,
    commission: 25.10,
    netEarning: 100.40,
    distance: '5.2 km',
    duration: '18 mins',
    passengerName: 'Sarah Tadesse',
    rating: 5
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Success Header */}
        <Card className="bg-green-800 border-green-600">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Trip Completed!</h1>
            <p className="text-green-100">Great job completing this ride</p>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Trip Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passenger */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Passenger</span>
              <span className="text-white font-medium">{tripData.passengerName}</span>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <MapPin className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Distance</div>
                <div className="text-white font-medium">{tripData.distance}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <Clock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Duration</div>
                <div className="text-white font-medium">{tripData.duration}</div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Passenger Rating</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < tripData.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Breakdown */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Earnings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Trip Fare</span>
              <span className="text-white font-medium">{tripData.fare.toFixed(2)} ETB</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Platform Commission (20%)</span>
              <span className="text-red-400 font-medium">-{tripData.commission.toFixed(2)} ETB</span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Your Earnings</span>
                <span className="text-2xl font-bold text-green-400">
                  {tripData.netEarning.toFixed(2)} ETB
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleContinue}
            className="w-full h-14 bg-green-600 hover:bg-green-700"
          >
            Continue Driving
          </Button>
          <Button 
            variant="outline"
            className="w-full border-gray-600 text-white hover:bg-gray-700"
          >
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
