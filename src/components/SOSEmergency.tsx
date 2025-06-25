
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, Shield } from 'lucide-react';

const SOSEmergency = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && countdown === 0) {
      // Trigger emergency alert
      console.log('Emergency alert sent!');
    }
  }, [isActive, countdown]);

  const handleTriggerSOS = () => {
    setIsActive(true);
  };

  const handleCancel = () => {
    setIsActive(false);
    setCountdown(5);
    navigate(-1);
  };

  const handleCallEmergency = () => {
    window.location.href = 'tel:+251911000000';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* SOS Header */}
        <Card className="bg-red-800 border-red-600">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-16 w-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Emergency SOS</h1>
            <p className="text-red-100">Your safety is our priority</p>
          </CardContent>
        </Card>

        {!isActive ? (
          <>
            {/* Emergency Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">What happens when you trigger SOS?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Location Sharing</h3>
                    <p className="text-gray-400 text-sm">Your current location will be shared with emergency services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Emergency Contact</h3>
                    <p className="text-gray-400 text-sm">Emergency services and Taxiye support will be notified</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <h3 className="text-white font-medium">Trip Information</h3>
                    <p className="text-gray-400 text-sm">Current trip details and passenger info will be shared</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trigger Button */}
            <Button 
              onClick={handleTriggerSOS}
              className="w-full h-16 bg-red-600 hover:bg-red-700 text-xl font-bold"
            >
              <AlertTriangle className="h-6 w-6 mr-2" />
              TRIGGER EMERGENCY SOS
            </Button>
          </>
        ) : (
          <>
            {/* Active SOS */}
            <Card className="bg-red-800 border-red-600">
              <CardContent className="p-6 text-center">
                <div className="text-6xl font-bold text-white mb-4">
                  {countdown}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {countdown > 0 ? 'Emergency Alert in...' : 'EMERGENCY ALERT SENT!'}
                </h2>
                <p className="text-red-100">
                  {countdown > 0 ? 'Cancel if this was triggered by mistake' : 'Help is on the way'}
                </p>
              </CardContent>
            </Card>

            {countdown > 0 && (
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="w-full h-14 border-gray-400 text-white hover:bg-gray-700"
              >
                Cancel Emergency Alert
              </Button>
            )}
          </>
        )}

        {/* Emergency Contacts */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleCallEmergency}
              className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency: 991
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Police: 991
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
            >
              <Phone className="h-4 w-4 mr-2" />
              Taxiye Support: +251-911-111-111
            </Button>
          </CardContent>
        </Card>

        {!isActive && (
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
          >
            Back to Trip
          </Button>
        )}
      </div>
    </div>
  );
};

export default SOSEmergency;
