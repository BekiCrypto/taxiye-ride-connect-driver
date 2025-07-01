
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, AlertTriangle } from 'lucide-react';
import { Driver } from '@/types/driver';

interface VehicleInfoStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const VehicleInfoStep = ({ data, onChange, onNext, isLoading }: VehicleInfoStepProps) => {
  const handleInputChange = (field: keyof Driver, value: string | number) => {
    onChange({ [field]: value });
  };

  const isFormValid = () => {
    const today = new Date();
    const insuranceExpiry = data.insurance_expiry_date ? new Date(data.insurance_expiry_date) : null;
    const roadworthinessExpiry = data.roadworthiness_expiry_date ? new Date(data.roadworthiness_expiry_date) : null;
    
    return (
      data.vehicle_make &&
      data.vehicle_model &&
      data.vehicle_year &&
      data.vehicle_color &&
      data.plate_number &&
      data.insurance_expiry_date &&
      data.roadworthiness_expiry_date &&
      insuranceExpiry &&
      roadworthinessExpiry &&
      insuranceExpiry > today &&
      roadworthinessExpiry > today
    );
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const vehicleMakes = [
    'Toyota', 'Hyundai', 'Nissan', 'Mitsubishi', 'Suzuki', 'Honda', 'Isuzu', 
    'Mazda', 'Subaru', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Other'
  ];

  const colors = [
    'White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Yellow', 'Brown', 'Other'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Car className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Vehicle Information</h3>
          </div>

          <Alert className="bg-blue-900/50 border-blue-700/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              All vehicle documents (insurance, roadworthiness certificate) must be current and valid for at least 30 days.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_make" className="text-gray-200">Vehicle Make *</Label>
              <Select value={data.vehicle_make || ''} onValueChange={(value) => handleInputChange('vehicle_make', value)}>
                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Select vehicle make" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleMakes.map((make) => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicle_model" className="text-gray-200">Vehicle Model *</Label>
              <Input
                id="vehicle_model"
                value={data.vehicle_model || ''}
                onChange={(e) => handleInputChange('vehicle_model', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="e.g., Corolla, Accent, Sunny"
              />
            </div>

            <div>
              <Label htmlFor="vehicle_year" className="text-gray-200">Vehicle Year *</Label>
              <Select value={data.vehicle_year?.toString() || ''} onValueChange={(value) => handleInputChange('vehicle_year', parseInt(value))}>
                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicle_color" className="text-gray-200">Vehicle Color *</Label>
              <Select value={data.vehicle_color || ''} onValueChange={(value) => handleInputChange('vehicle_color', value)}>
                <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="plate_number" className="text-gray-200">Plate Number *</Label>
              <Input
                id="plate_number"
                value={data.plate_number || ''}
                onChange={(e) => handleInputChange('plate_number', e.target.value.toUpperCase())}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="e.g., AA-12345"
              />
            </div>

            <div>
              <Label htmlFor="insurance_expiry" className="text-gray-200">Insurance Expiry Date *</Label>
              <Input
                id="insurance_expiry"
                type="date"
                value={data.insurance_expiry_date || ''}
                onChange={(e) => handleInputChange('insurance_expiry_date', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="roadworthiness_expiry" className="text-gray-200">Roadworthiness Expiry Date *</Label>
              <Input
                id="roadworthiness_expiry"
                type="date"
                value={data.roadworthiness_expiry_date || ''}
                onChange={(e) => handleInputChange('roadworthiness_expiry_date', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>
          </div>

          <Alert className="bg-yellow-900/50 border-yellow-700/50">
            <AlertDescription className="text-yellow-200">
              <strong>Required Documents:</strong> You'll need to upload vehicle photos, insurance certificate, and roadworthiness certificate in the document upload section.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={!isFormValid() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue to Service Agreement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleInfoStep;
