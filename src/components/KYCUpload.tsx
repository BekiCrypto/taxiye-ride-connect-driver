
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { useAIVerification } from '@/hooks/useAIVerification';
import { useKYCLogic } from '@/hooks/useKYCLogic';
import { useKYCActions } from '@/hooks/useKYCActions';
import KYCSuccessState from './kyc/KYCSuccessState';
import KYCRejectionState from './kyc/KYCRejectionState';
import KYCCameraInterface from './kyc/KYCCameraInterface';
import KYCAIVerificationInterface from './kyc/KYCAIVerificationInterface';
import KYCDocumentList from './kyc/KYCDocumentList';
import KYCActionButtons from './kyc/KYCActionButtons';
import KYCSelfieOptions from './kyc/KYCSelfieOptions';
import KYCHeader from './kyc/KYCHeader';
import KYCStatusAlert from './kyc/KYCStatusAlert';
import KYCMissingDocuments from './kyc/KYCMissingDocuments';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const { driver, signOut } = useDriverAuth();
  const { uploads, uploading, uploadDocument } = useDocumentUpload();
  const { verifying, verificationStep, progress } = useAIVerification();
  
  const {
    currentUploadType,
    showCamera,
    showSelfieOptions,
    showAIVerification,
    submittingForReview,
    fileInputRef,
    videoRef,
    setShowCamera,
    setShowSelfieOptions,
    setShowAIVerification,
    setSubmittingForReview,
    handleFileUpload,
    handleTakeLiveSelfie,
    handleUploadSelfie,
    cancelCamera,
    validateFile
  } = useKYCLogic();

  const documents = [
    { key: 'national_id', label: 'National ID or Passport', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'driver_license', label: "Driver's License", required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'vehicle_photo', label: 'Vehicle Photo', required: true, formats: 'JPEG, PNG' },
    { key: 'ownership', label: 'Proof of Car Ownership', required: true, formats: 'PDF, JPEG, PNG' },
    { key: 'selfie', label: 'Selfie Photo', required: true, formats: 'JPEG, PNG' }
  ];

  const {
    missingDocs,
    handleFileChange,
    takeSelfie,
    handleAIVerification,
    handleSubmitForApproval
  } = useKYCActions(documents, uploads, currentUploadType, setSubmittingForReview, setShowAIVerification, onApproval);

  const allDocsUploaded = documents.every(doc => 
    uploads[doc.key]?.status === 'uploaded'
  );

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
        onCapture={() => takeSelfie(videoRef, setShowCamera)} 
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
        <KYCHeader onSignOut={signOut} />
        <CardContent className="space-y-4">
          <KYCStatusAlert driver={driver!} />

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

          <KYCMissingDocuments missingDocs={missingDocs} />

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
            onChange={(e) => handleFileChange(e, validateFile)}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCUpload;
