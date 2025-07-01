
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle } from 'lucide-react';
import { Driver } from '@/types/driver';

interface LicenseInfoStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const LicenseInfoStep = ({ data, onChange, onNext, isLoading }: LicenseInfoStepProps) => {
  const handleInputChange = (field: keyof Driver, value: string) => {
    onChange({ [field]: value });
  };

  const isFormValid = () => {
    const today = new Date();
    const expiryDate = data.license_expiry_date ? new Date(data.license_expiry_date) : null;
    
    return (
      data.license_number &&
      data.license_expiry_date &&
      expiryDate &&
      expiryDate > today
    );
  };

  const isExpiryValid = () => {
    if (!data.license_expiry_date) return true;
    const today = new Date();
    const expiryDate = new Date(data.license_expiry_date);
    return expiryDate > today;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Driving License Details</h3>
          </div>

          <Alert className="bg-blue-900/50 border-blue-700/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              Your driving license must be valid and not expire within the next 30 days to qualify for the platform.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="license_number" className="text-gray-200">License Number *</Label>
              <Input
                id="license_number"
                value={data.license_number || ''}
                onChange={(e) => handleInputChange('license_number', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                placeholder="Enter your license number"
              />
            </div>

            <div>
              <Label htmlFor="license_expiry" className="text-gray-200">License Expiry Date *</Label>
              <Input
                id="license_expiry"
                type="date"
                value={data.license_expiry_date || ''}
                onChange={(e) => handleInputChange('license_expiry_date', e.target.value)}
                className="bg-gray-600 border-gray-500 text-white"
                min={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              {data.license_expiry_date && !isExpiryValid() && (
                <p className="text-red-400 text-sm mt-1">
                  License expiry date must be in the future
                </p>
              )}
            </div>
          </div>

          <Alert className="bg-yellow-900/50 border-yellow-700/50">
            <AlertDescription className="text-yellow-200">
              <strong>Required Documents:</strong> You'll need to upload clear photos of both the front and back of your driving license in the document upload section.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={!isFormValid() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue to Vehicle Information
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LicenseInfoStep;
