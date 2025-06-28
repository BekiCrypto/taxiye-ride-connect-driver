
import { toast } from '@/hooks/use-toast';
import { useDocumentUpload } from './useDocumentUpload';
import { useAIVerification } from './useAIVerification';

interface Document {
  key: string;
  label: string;
  required: boolean;
  formats: string;
}

export const useKYCActions = (
  documents: Document[],
  uploads: Record<string, any>,
  currentUploadType: string,
  setSubmittingForReview: (submitting: boolean) => void,
  setShowAIVerification: (show: boolean) => void,
  onApproval: () => void
) => {
  const { uploadDocument } = useDocumentUpload();
  const { startAIVerification, submitForManualReview } = useAIVerification();

  const missingDocs = documents.filter(doc => 
    uploads[doc.key]?.status !== 'uploaded'
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, validateFile: (file: File) => boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

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

  const takeSelfie = async (videoRef: React.RefObject<HTMLVideoElement>, setShowCamera: (show: boolean) => void) => {
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

  const handleAIVerification = async () => {
    const allDocsUploaded = documents.every(doc => 
      uploads[doc.key]?.status === 'uploaded'
    );

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
    const allDocsUploaded = documents.every(doc => 
      uploads[doc.key]?.status === 'uploaded'
    );

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

  return {
    missingDocs,
    handleFileChange,
    takeSelfie,
    handleAIVerification,
    handleSubmitForApproval
  };
};
