
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, User, FileText, Car, Clipboard } from 'lucide-react';
import { Driver } from '@/types/driver';

interface ReviewSubmitStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const ReviewSubmitStep = ({ data, onNext, isLoading }: ReviewSubmitStepProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clipboard className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Review Your Application</h3>
          </div>

          <Alert className="bg-blue-900/50 border-blue-700/50">
            <AlertDescription className="text-blue-200">
              Please review all information carefully before submitting. Once submitted, your application will be reviewed by our compliance team in accordance with EtASN requirements.
            </AlertDescription>
          </Alert>

          {/* Personal Information Review */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <User className="h-4 w-4 text-green-400" />
                <h4 className="font-medium text-white">Personal Information</h4>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Name:</div>
                <div className="text-white">{data.name}</div>
                <div className="text-gray-400">Gender:</div>
                <div className="text-white">{data.gender}</div>
                <div className="text-gray-400">Date of Birth:</div>
                <div className="text-white">{formatDate(data.date_of_birth)}</div>
                <div className="text-gray-400">Email:</div>
                <div className="text-white">{data.email}</div>
                <div className="text-gray-400">National ID:</div>
                <div className="text-white">{data.national_id_number}</div>
              </div>
            </CardContent>
          </Card>

          {/* License Information Review */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-4 w-4 text-green-400" />
                <h4 className="font-medium text-white">License Information</h4>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">License Number:</div>
                <div className="text-white">{data.license_number}</div>
                <div className="text-gray-400">Expiry Date:</div>
                <div className="text-white">{formatDate(data.license_expiry_date)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information Review */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Car className="h-4 w-4 text-green-400" />
                <h4 className="font-medium text-white">Vehicle Information</h4>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">Make & Model:</div>
                <div className="text-white">{data.vehicle_make} {data.vehicle_model}</div>
                <div className="text-gray-400">Year:</div>
                <div className="text-white">{data.vehicle_year}</div>
                <div className="text-gray-400">Color:</div>
                <div className="text-white">{data.vehicle_color}</div>
                <div className="text-gray-400">Plate Number:</div>
                <div className="text-white">{data.plate_number}</div>
                <div className="text-gray-400">Insurance Expiry:</div>
                <div className="text-white">{formatDate(data.insurance_expiry_date)}</div>
                <div className="text-gray-400">Roadworthiness Expiry:</div>
                <div className="text-white">{formatDate(data.roadworthiness_expiry_date)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Service Agreement Review */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-4 w-4 text-green-400" />
                <h4 className="font-medium text-white">Service Agreement</h4>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-sm">
                <div className="text-gray-400 mb-1">Status:</div>
                <div className="text-green-400">✓ Signed and Agreed</div>
                <div className="text-gray-400 mt-2 mb-1">Digital Signature:</div>
                <div className="text-white italic">{data.digital_signature_url}</div>
                <div className="text-gray-400 mt-2 mb-1">Agreement Date:</div>
                <div className="text-white">{formatDate(data.service_agreement_date)}</div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-yellow-900/50 border-yellow-700/50">
            <AlertDescription className="text-yellow-200">
              <strong>Next Steps:</strong> After submission, you'll need to upload all required documents (ID, license, vehicle photos, certificates) and wait for admin approval. The review process typically takes 1-3 business days.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitStep;
