
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PassengerRegistrationProps {
  onComplete: () => void;
}

const PassengerRegistration = ({ onComplete }: PassengerRegistrationProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    emergencyContact: '',
    homeAddress: '',
    workAddress: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('passengers').insert({
        user_id: user.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || user.email
      });

      if (error) throw error;

      toast({
        title: "Registration Complete! ✅",
        description: "Welcome to Taxiye! You can now book rides."
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
                alt="Taxiye Logo" 
                className="h-12 w-auto mx-auto mb-2"
              />
            </div>
            <CardTitle className="text-white">Passenger Registration</CardTitle>
            <p className="text-xs text-gray-400 mt-1">
              Join Taxiye - Electronic Taxi Dispatch System ኤታስ' Directive Compliant
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+251911234567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContact" className="text-white">
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    placeholder="+251911234567"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="homeAddress" className="text-white flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Home Address</span>
                  </Label>
                  <Input
                    id="homeAddress"
                    type="text"
                    placeholder="Enter your home address"
                    value={formData.homeAddress}
                    onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="workAddress" className="text-white flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Work Address (Optional)</span>
                  </Label>
                  <Input
                    id="workAddress"
                    type="text"
                    placeholder="Enter your work address"
                    value={formData.workAddress}
                    onChange={(e) => handleInputChange('workAddress', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PassengerRegistration;
