
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, Camera, LogOut, Home, Sparkles, Eye, AlertTriangle, Clock } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useAIVerification } from '@/hooks/useAIVerification';
import { toast } from '@/hooks/use-toast';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const { driver, signOut } = useDriverAuth();
  const { uploads, uploading, uploadDocument, capturePhoto } = useDocumentUpload();
  const { verifying, verificationStep, progress, startAIVerification, submitForManualReview } = useAIVerification();
  
  const [currentUploadType, setCurrentUploadType] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [showAIVerification, setShowAIVerification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const documents = [
    { key: 'national_id', label: 'National ID or Passport', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'driver_license', label: "Driver's License", required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'vehicle_photo', label: 'Vehicle Photo', required: true, formats: 'JPEG, PNG' },
    { key: 'ownership', label: 'Proof of Car Ownership', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'selfie', label: 'Selfie Photo', required: true, formats: 'JPEG, PNG' }
  ];

  // Check if all documents are uploaded
  const allDocsUploaded = documents.every(doc => 
    uploads[doc.key]?.status === 'uploaded'
  );

  const handleFileUpload = (docKey: string) => {
    setCurrentUploadType(docKey);
    if (docKey === 'selfie') {
      setShowCamera(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, JPEG, or PNG files only",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    await uploadDocument(currentUploadType, file);
    event.target.value = '';
  };

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
      setShowCamera(false);
    }
  };

  const takeSelfie = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context?.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        await uploadDocument('selfie', file);
        setShowCamera(false);
        
        // Stop camera stream
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }, 'image/jpeg', 0.8);
  };

  const cancelCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };

  const handleAIVerification = async () => {
    if (!allDocsUploaded) {
      toast({
        title: "Upload Required",
        description: "Please upload all required documents first",
        variant: "destructive"
      });
      return;
    }

    setShowAIVerification(true);
    const result = await startAIVerification();
    
    if (result?.success && result?.autoApproved) {
      setTimeout(() => onApproval(), 2000);
    }
  };

  useEffect(() => {
    if (showCamera) {
      handleCameraCapture();
    }
  }, [showCamera]);

  // Show success state if approved
  if (driver?.approved_status === 'approved') {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
                alt="Taxiye Logo" 
                className="h-12 w-auto mx-auto"
              />
            </div>
            <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">You're All Set! 🎉</CardTitle>
            <p className="text-gray-400">Your documents have been approved and you can now start driving.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={onApproval}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button
              onClick={signOut}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show rejection state with reason
  if (driver?.approved_status === 'rejected' && driver.rejection_reason) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
                alt="Taxiye Logo" 
                className="h-12 w-auto mx-auto"
              />
            </div>
            <div className="mx-auto w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Documents Rejected</CardTitle>
            <p className="text-gray-400">Your documents need to be corrected and resubmitted.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-red-900/50 border-red-700/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                <div className="font-medium mb-2">Rejection Reason:</div>
                {driver.rejection_reason}
              </AlertDescription>
            </Alert>

            {driver.admin_notes && (
              <Alert className="bg-blue-900/50 border-blue-700/50">
                <AlertDescription className="text-blue-200">
                  <div className="font-medium mb-2">Admin Notes:</div>
                  {driver.admin_notes}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Upload New Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show camera interface
  if (showCamera) {
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
                onClick={takeSelfie}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture
              </Button>
              <Button
                onClick={cancelCamera}
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
  }

  // Show AI verification process
  if (showAIVerification && verifying) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              verificationStep === 'liveness' ? 'bg-green-600' : 'bg-purple-600'
            } animate-pulse`}>
              {verificationStep === 'liveness' ? (
                <Eye className="h-8 w-8 text-white" />
              ) : (
                <Sparkles className="h-8 w-8 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {verificationStep === 'liveness' ? 'Liveness Check' : 'AI Verification'}
            </CardTitle>
            <p className="text-gray-400">
              {verificationStep === 'liveness' 
                ? 'Please look directly at your camera...'
                : 'AI is analyzing your documents...'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {verificationStep === 'liveness' && (
              <div className="flex justify-center">
                <div className="w-32 h-32 border-4 border-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <Eye className="h-16 w-16 text-green-400" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main upload interface
  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="mx-auto">
              <img 
                src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
                alt="Taxiye Logo" 
                className="h-12 w-auto mx-auto"
              />
            </div>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Document Verification</CardTitle>
          <p className="text-gray-400">
            {driver?.approved_status === 'pending' && driver.admin_notes
              ? 'Your documents are under review'
              : 'Please upload clear photos/PDFs of all required documents'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {driver?.approved_status === 'pending' && driver.admin_notes && (
            <Alert className="bg-yellow-900/50 border-yellow-700/50">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-yellow-200">
                <div className="font-medium mb-1">Status: Under Review</div>
                {driver.admin_notes}
              </AlertDescription>
            </Alert>
          )}

          <Alert className="bg-blue-900 border-blue-700">
            <AlertDescription className="text-blue-200">
              Upload all required documents to enable AI-assisted verification for faster processing.
            </AlertDescription>
          </Alert>

          {documents.map((doc) => (
            <Card key={doc.key} className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {uploads[doc.key]?.status === 'uploaded' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : doc.key === 'selfie' ? (
                      <Camera className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="text-white font-medium">{doc.label}</div>
                      <div className="text-xs text-gray-400">{doc.formats}</div>
                      {doc.required && (
                        <Badge variant="destructive" className="text-xs mt-1">Required</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleFileUpload(doc.key)}
                    disabled={uploads[doc.key]?.status === 'uploaded' || uploading}
                    className={
                      uploads[doc.key]?.status === 'uploaded'
                        ? 'bg-green-600 text-white'
                        : doc.key === 'selfie'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }
                  >
                    {uploads[doc.key]?.status === 'uploaded' 
                      ? 'Uploaded' 
                      : doc.key === 'selfie' 
                      ? 'Take Selfie' 
                      : uploading && currentUploadType === doc.key
                      ? 'Uploading...'
                      : 'Upload'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {allDocsUploaded && (
            <div className="space-y-3">
              <Alert className="bg-green-900 border-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-200">
                  All documents uploaded successfully! Choose your verification method:
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleAIVerification}
                disabled={verifying}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {verifying ? 'AI Verifying...' : 'AI-Assisted Verification (Instant)'}
              </Button>

              <Button
                onClick={async () => {
                  const success = await submitForManualReview();
                  if (success) {
                    toast({
                      title: "Submitted for Review",
                      description: "Your documents will be reviewed within 24-48 hours",
                    });
                  }
                }}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Manual Review (24-48 hours)
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCUpload;
