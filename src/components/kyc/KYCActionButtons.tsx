
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Send, Sparkles, AlertTriangle } from 'lucide-react';

interface KYCActionButtonsProps {
  allDocsUploaded: boolean;
  submittingForReview: boolean;
  verifying: boolean;
  missingDocsCount: number;
  onSubmitForApproval: () => void;
  onAIVerification: () => void;
}

const KYCActionButtons = ({
  allDocsUploaded,
  submittingForReview,
  verifying,
  missingDocsCount,
  onSubmitForApproval,
  onAIVerification
}: KYCActionButtonsProps) => {
  if (allDocsUploaded) {
    return (
      <div className="space-y-3">
        <Alert className="bg-green-900 border-green-700">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-200">
            All documents uploaded successfully! Choose your verification method:
          </AlertDescription>
        </Alert>

        <Button
          onClick={onSubmitForApproval}
          disabled={submittingForReview}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          {submittingForReview ? 'Submitting...' : 'Submit for Approval (24-48 hours)'}
        </Button>

        <Button
          onClick={onAIVerification}
          disabled={verifying}
          variant="outline"
          className="w-full border-purple-600 text-purple-300 hover:bg-purple-900/20"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {verifying ? 'AI Verifying...' : 'Try AI-Assisted Verification (Instant)'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={onSubmitForApproval}
        disabled={true}
        className="w-full bg-gray-600 text-gray-400 cursor-not-allowed"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        Upload All Documents First ({missingDocsCount} remaining)
      </Button>

      <Button
        onClick={onAIVerification}
        disabled={true}
        variant="outline"
        className="w-full border-gray-600 text-gray-500 cursor-not-allowed"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Complete Uploads for AI Verification
      </Button>
    </div>
  );
};

export default KYCActionButtons;
