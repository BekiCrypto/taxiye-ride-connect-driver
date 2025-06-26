
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KYCCameraInterfaceProps {
  onCapture: () => void;
  onCancel: () => void;
}

const KYCCameraInterface = ({ onCapture, onCancel }: KYCCameraInterfaceProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take a selfie",
        variant: "destructive"
      });
      onCancel();
    }
  };

  useEffect(() => {
    handleCameraCapture();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Take Selfie</CardTitle>
          <p className="text-gray-400">Position your face in the center and click capture</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              playsInline
              muted
            />
            <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg pointer-events-none" />
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={onCapture}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCCameraInterface;
