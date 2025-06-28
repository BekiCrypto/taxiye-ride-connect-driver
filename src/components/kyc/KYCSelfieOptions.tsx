
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';

interface KYCSelfieOptionsProps {
  onTakeLiveSelfie: () => void;
  onUploadPhoto: () => void;
  onCancel: () => void;
}

const KYCSelfieOptions = ({ onTakeLiveSelfie, onUploadPhoto, onCancel }: KYCSelfieOptionsProps) => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center relative">
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-white">Choose Selfie Option</CardTitle>
          <p className="text-gray-400">How would you like to provide your selfie photo?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onTakeLiveSelfie}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-16"
          >
            <Camera className="h-6 w-6 mr-3" />
            <div className="text-left">
              <div className="font-medium">Take Live Selfie</div>
              <div className="text-sm opacity-80">Use your camera to take a photo now</div>
            </div>
          </Button>

          <Button
            onClick={onUploadPhoto}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 h-16"
          >
            <Upload className="h-6 w-6 mr-3" />
            <div className="text-left">
              <div className="font-medium">Upload Photo</div>
              <div className="text-sm opacity-80">Choose an existing photo from your device</div>
            </div>
          </Button>

          <div className="text-center text-sm text-gray-400 mt-4">
            Make sure your face is clearly visible and well-lit in the photo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCSelfieOptions;
