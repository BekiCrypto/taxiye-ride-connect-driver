
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KYCCameraInterfaceProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onCapture: () => void;
  onCancel: () => void;
}

const KYCCameraInterface = ({ videoRef, onCapture, onCancel }: KYCCameraInterfaceProps) => {
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
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
    
    return () => {
      // Cleanup camera stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
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
              className="w-full rounded-lg bg-gray-700"
              autoPlay
              playsInline
              muted
              style={{ transform: 'scaleX(-1)' }} // Mirror effect for better UX
            />
            <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-48 h-56 border-2 border-white/50 rounded-full pointer-events-none" />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={onCapture}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture Selfie
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-400">
            Make sure your face is clearly visible and well-lit
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCCameraInterface;
