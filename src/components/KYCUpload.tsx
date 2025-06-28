
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, LogOut, Clock } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useAIVerification } from '@/hooks/useAIVerification';
import { toast } from '@/hooks/use-toast';
import KYCSuccessState from './kyc/KYCSuccessState';
import KYCRejectionState from './kyc/KYCRejectionState';
import KYCCameraInterface from './kyc/KYCCameraInterface';
import KYCAIVerificationInterface from './kyc/KYCAIVerificationInterface';
import KYCDocumentList from './kyc/KYCDocumentList';
import KYCActionButtons from './kyc/KYCActionButtons';
import KYCSelfieOptions from './kyc/KYCSelfieOptions';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const { driver, signOut } = useDriverAuth();
  const { uploads, uploading, uploadDocument } = useDocumentUpload();
  const { verifying, verificationStep, progress, startAIVerification, submitForManualReview } = useAIVerification();
  
  const [currentUploadType, setCurrentUploadType] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [showSelfieOptions, setShowSelfieOptions] = useState(false);
  const [showAIVerification, setShowAIVerification] = useState(false);
  const [submittingForReview, setSubmittingForReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const documents = [
    { key: 'national_id', label: 'National ID or Passport', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'driver_license', label: "Driver's License", required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'vehicle_photo', label: 'Vehicle Photo', required: true, formats: 'JPEG, PNG' },
    { key: 'ownership', label: 'Proof of Car Ownership', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'selfie', label: 'Selfie Photo', required: true, formats: 'JPEG, PNG' }
  ];

  const allDocsUploaded = documents.every(doc => 
    uploads[doc.key]?.status === 'uploaded'
  );

  const missingDocs = documents.filter(doc => 
    uploads[doc.key]?.status !== 'uploaded'
  );

  const handleFileUpload = (docKey: string) => {
    setCurrentUploadType(docKey);
    if (docKey === 'selfie') {
      setShowSelfieOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    console.log(`Uploading ${currentUploadType}:`, file.name);
    const success = await uploadDocument(currentUploadType, file);
    
    if (success) {
      toast({
        title: "Upload Successful! ✅",
        description: `${documents.find(d => d.key === currentUploadType)?.label} uploaded successfully`,
      });
    }
    
    event.target.value = '';
  };

  const handleTakeLiveSelfie = () => {
    setShowSelfieOptions(false);
    setShowCamera(true);
  };

  const handleUploadSelfie = () => {
    setShowSelfieOptions(false);
    fileInputRef.current?.click();
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
        console.log('Uploading live selfie...');
        const success = await uploadDocument('selfie', file);
        
        if (success) {
          toast({
            title: "Selfie Captured! 📸",
            description: "Your selfie has been uploaded successfully",
          });
        }
        
        setShowCamera(false);
        
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
      const missingDocNames = missingDocs.map(doc => doc.label).join(', ');
      toast({
        title: "Missing Documents ⚠️",
        description: `Please upload the following documents first: ${missingDocNames}`,
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

  const handleSubmitForApproval = async () => {
    if (!allDocsUploaded) {
      const missingDocNames = missingDocs.map(doc => doc.label).join(', ');
      toast({
        title: "Missing Documents ⚠️",
        description: `Please upload these remaining documents before submitting: ${missingDocNames}`,
        variant: "destructive"
      });
      return;
    }

    setSubmittingForReview(true);
    const success = await submitForManualReview();
    
    if (success) {
      toast({
        title: "Documents Submitted! 📋",
        description: "Your documents have been submitted for review. You'll be notified within 24-48 hours.",
      });
    }
    setSubmittingForReview(false);
  };

  // Show success state if approved
  if (driver?.approved_status === 'approved') {
    return <KYCSuccessState onApproval={onApproval} onSignOut={signOut} />;
  }

  // Show rejection state with reason
  if (driver?.approved_status === 'rejected' && driver.rejection_reason) {
    return <KYCRejectionState driver={driver} />;
  }

  // Show selfie options modal
  if (showSelfieOptions) {
    return (
      <KYCSelfieOptions
        onTakeLiveSelfie={handleTakeLiveSelfie}
        onUploadPhoto={handleUploadSelfie}
        onCancel={() => setShowSelfieOptions(false)}
      />
    );
  }

  // Show camera interface
  if (showCamera) {
    return (
      <KYCCameraInterface 
        videoRef={videoRef}
        onCapture={takeSelfie} 
        onCancel={cancelCamera}
      />
    );
  }

  // Show AI verification process
  if (showAIVerification && verifying) {
    return (
      <KYCAIVerificationInterface 
        verificationStep={verificationStep}
        progress={progress}
      />
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
              Upload all required documents to submit for approval or try AI-assisted verification for faster processing.
            </AlertDescription>
          </Alert>

          <KYCDocumentList
            documents={documents}
            uploads={uploads}
            uploading={uploading}
            currentUploadType={currentUploadType}
            onUpload={handleFileUpload}
          />

          {!allDocsUploaded && missingDocs.length > 0 && (
            <Alert className="bg-orange-900/50 border-orange-700/50">
              <AlertDescription className="text-orange-200">
                <div className="font-medium mb-1">Missing Documents ({missingDocs.length}):</div>
                <ul className="list-disc list-inside text-sm">
                  {missingDocs.map(doc => (
                    <li key={doc.key}>{doc.label}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <KYCActionButtons
            allDocsUploaded={allDocsUploaded}
            submittingForReview={submittingForReview}
            verifying={verifying}
            missingDocsCount={missingDocs.length}
            onSubmitForApproval={handleSubmitForApproval}
            onAIVerification={handleAIVerification}
          />

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
