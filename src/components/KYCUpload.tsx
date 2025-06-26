
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, Camera, LogOut, Home, Sparkles } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { toast } from '@/components/ui/use-toast';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const { driver, updateDriverProfile, signOut } = useDriverAuth();
  const [uploadedDocs, setUploadedDocs] = useState({
    nationalId: false,
    driverLicense: false,
    vehiclePhoto: false,
    ownership: false,
    selfie: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [showAIVerification, setShowAIVerification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadType, setCurrentUploadType] = useState<string>('');

  const documents = [
    { key: 'nationalId', label: 'National ID or Passport', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'driverLicense', label: "Driver's License", required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'vehiclePhoto', label: 'Vehicle Photo', required: true, formats: 'JPEG, PNG' },
    { key: 'ownership', label: 'Proof of Car Ownership', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'selfie', label: 'Selfie Photo', required: true, formats: 'JPEG, PNG' }
  ];

  const handleFileUpload = (docKey: string) => {
    setCurrentUploadType(docKey);
    if (docKey === 'selfie') {
      // For selfie, we'll simulate camera capture
      handleSelfieCapture();
    } else {
      // For other documents, open file picker
      fileInputRef.current?.click();
    }
  };

  const handleSelfieCapture = () => {
    // Simulate selfie capture - in real app, this would use camera API
    setUploadedDocs(prev => ({ ...prev, selfie: true }));
    toast({
      title: "Selfie Captured",
      description: "Your selfie has been captured successfully",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, JPEG, or PNG files only",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Simulate file upload
    setUploadedDocs(prev => ({ ...prev, [currentUploadType]: true }));
    toast({
      title: "Document Uploaded",
      description: `${documents.find(d => d.key === currentUploadType)?.label} uploaded successfully`,
    });

    // Reset file input
    event.target.value = '';
  };

  const allDocsUploaded = Object.values(uploadedDocs).every(Boolean);

  const handleSubmit = async () => {
    if (!allDocsUploaded) return;

    setSubmitting(true);
    
    // Simulate manual review process
    setTimeout(async () => {
      if (driver) {
        await updateDriverProfile({ 
          approved_status: 'approved' as const
        });
        
        toast({
          title: "Congratulations! 🎉",
          description: "Your documents have been approved. You can now start driving!",
        });
        
        onApproval();
      }
      setSubmitting(false);
    }, 2000);
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

    setSubmitting(true);
    
    // Simulate AI verification process
    setTimeout(async () => {
      const verificationSuccess = Math.random() > 0.3; // 70% success rate for demo
      
      if (verificationSuccess && driver) {
        await updateDriverProfile({ 
          approved_status: 'approved' as const
        });
        
        toast({
          title: "AI Verification Successful! 🤖✅",
          description: "Your documents have been automatically verified. You can now start driving!",
        });
        
        onApproval();
      } else {
        toast({
          title: "AI Verification Failed",
          description: "Your documents require manual review. Our team will review them within 24-48 hours.",
          variant: "destructive"
        });
      }
      setSubmitting(false);
    }, 3000);
  };

  const navigateToHome = () => {
    // This would navigate to main app - handled by parent component
    onApproval();
  };

  const getStatusMessage = () => {
    if (!driver) return "Loading...";
    
    switch (driver.approved_status) {
      case 'pending':
        return "Please upload your documents to get approved as a driver";
      case 'rejected':
        return "Your documents were rejected. Please re-upload them with correct information";
      case 'approved':
        return "Your documents are approved! You can now start driving.";
      default:
        return "Please upload your documents to get approved as a driver";
    }
  };

  // If driver is already approved, show success state with navigation
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
              onClick={navigateToHome}
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
          <p className="text-gray-400">{getStatusMessage()}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-900 border-blue-700">
            <AlertDescription className="text-blue-200">
              Please upload clear photos/PDFs of all required documents. You can also use our AI-assisted verification for faster processing.
            </AlertDescription>
          </Alert>

          {documents.map((doc) => (
            <Card key={doc.key} className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {uploadedDocs[doc.key as keyof typeof uploadedDocs] ? (
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
                        <div className="text-red-400 text-xs">Required</div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleFileUpload(doc.key)}
                    disabled={uploadedDocs[doc.key as keyof typeof uploadedDocs]}
                    className={
                      uploadedDocs[doc.key as keyof typeof uploadedDocs]
                        ? 'bg-green-600 text-white'
                        : doc.key === 'selfie'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }
                  >
                    {uploadedDocs[doc.key as keyof typeof uploadedDocs] 
                      ? 'Uploaded' 
                      : doc.key === 'selfie' 
                      ? 'Take Selfie' 
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
                <AlertDescription className="text-green-200">
                  All documents uploaded successfully! Choose your verification method:
                </AlertDescription>
              </Alert>

              {/* AI Verification Option */}
              <Button
                onClick={handleAIVerification}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {submitting ? 'AI Verifying...' : 'AI-Assisted Verification (Instant)'}
              </Button>

              {/* Manual Verification Option */}
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {submitting ? 'Processing...' : 'Manual Review (24-48 hours)'}
              </Button>
            </div>
          )}

          {/* Hidden file input */}
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
