
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, Shield, MapPin } from 'lucide-react';

const SOSEmergency = () => {
  const [sosActivated, setSosActivated] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (sosActivated && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (sosActivated && countdown === 0) {
      // SOS would be fully activated here
      console.log('SOS Alert sent to emergency services');
    }
  }, [sosActivated, countdown]);

  const handleActivateSOS = () => {
    setSosActivated(true);
  };

  const handleCancel = () => {
    setSosActivated(false);
    setCountdown(5);
    navigate('/active-trip');
  };

  const emergencyContacts = [
    { name: 'Police', number: '911', icon: Shield },
    { name: 'Ambulance', number: '907', icon: Phone },
    { name: 'Taxiye Support', number: '+251911000000', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-red-900 p-4 space-y-6">
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Emergency SOS</h1>
        <p className="text-red-200">Your safety is our priority</p>
      </div>

      {!sosActivated ? (
        <Card className="bg-red-800 border-red-600">
          <CardHeader>
            <CardTitle className="text-white text-center">Emergency Assistance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-red-100 text-center">
              Press the button below if you're in an emergency situation. 
              This will immediately alert emergency services and Taxiye support with your location.
            </div>
            
            <Button
              onClick={handleActivateSOS}
              className="w-full h-16 bg-red-600 hover:bg-red-700 text-white text-xl font-bold"
            >
              <AlertTriangle className="h-6 w-6 mr-2" />
              ACTIVATE SOS
            </Button>

            <div className="text-red-200 text-sm text-center">
              Only use in genuine emergency situations
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-red-800 border-red-600">
          <CardContent className="p-6 text-center">
            <div className="text-6xl font-bold text-white mb-4">{countdown}</div>
            <div className="text-white text-xl mb-4">
              {countdown > 0 ? 'SOS activating in...' : 'SOS ACTIVATED!'}
            </div>
            <div className="text-red-200 mb-6">
              Emergency services and Taxiye support have been notified of your location
            </div>
            
            {countdown > 0 && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-800"
              >
                Cancel SOS
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-red-800 border-red-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Current Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-100">
            Your location is being shared with emergency services
          </div>
          <div className="text-red-200 text-sm mt-1">
            Lat: 9.0320, Long: 38.7630 (Addis Ababa)
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-800 border-red-600">
        <CardHeader>
          <CardTitle className="text-white">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-red-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-white" />
                  <div>
                    <div className="text-white font-medium">{contact.name}</div>
                    <div className="text-red-200 text-sm">{contact.number}</div>
                  </div>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Call
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SOSEmergency;
