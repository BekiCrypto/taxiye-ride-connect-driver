
import React from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useDocumentExpiry } from '@/hooks/useDocumentExpiry';
import KYCSuccessState from './kyc/KYCSuccessState';
import KYCRejectionState from './kyc/KYCRejectionState';
import MultiStepRegistration from './registration/MultiStepRegistration';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const { driver, signOut } = useDriverAuth();
  const { getDocumentStatus } = useDocumentExpiry();

  // Show success state if approved
  if (driver?.approved_status === 'approved') {
    return <KYCSuccessState onApproval={onApproval} onSignOut={signOut} />;
  }

  // Show rejection state with reason
  if (driver?.approved_status === 'rejected' && driver.rejection_reason) {
    return <KYCRejectionState driver={driver} />;
  }

  // Show multi-step registration if not complete
  if (!driver?.is_registration_complete) {
    return <MultiStepRegistration onComplete={onApproval} />;
  }

  // If registration is complete but not approved, show waiting state
  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">⏳</span>
        </div>
        <h2 className="text-xl font-semibold text-white">Application Under Review</h2>
        <p className="text-gray-300">
          Your registration has been submitted successfully. Our compliance team is reviewing your application in accordance with EtASN requirements.
        </p>
        <p className="text-sm text-gray-400">
          You will receive a notification once the review is complete. This typically takes 1-3 business days.
        </p>
        <button
          onClick={signOut}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default KYCUpload;
