
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
  const { uploadDocument, resetUpload } = useDocumentUpload();
  const { startAIVerification, submitForManualReview } = useAIVerification();

  const missingDocs = documents.filter(doc => 
    uploads[doc.key]?.status !== 'uploaded'
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, validateFile: (file: File) => boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`Processing file upload for ${currentUploadType}:`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Reset any previous failed upload for this type
    if (uploads[currentUploadType]?.status === 'failed') {
      resetUpload(currentUploadType);
    }

    if (!validateFile(file)) {
      console.log('File validation failed');
      return;
    }

    console.log(`Starting upload for ${currentUploadType}:`, file.name);
    
    const success = await uploadDocument(currentUploadType, file);
    
    if (success) {
      const docLabel = documents.find(d => d.key === currentUploadType)?.label || currentUploadType;
      console.log(`Upload successful for ${currentUploadType}`);
    } else {
      console.log(`Upload failed for ${currentUploadType}`);
    }
    
    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const takeSelfie = async (videoRef: React.RefObject<HTMLVideoElement>, setShowCamera: (show: boolean) => void) => {
    if (!videoRef.current) {
      console.error('Video reference not available for selfie capture');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Unable to create canvas context for selfie');
      }
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      context.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
          console.log('Capturing selfie...', { fileSize: file.size });
          
          const success = await uploadDocument('selfie', file);
          
          if (success) {
            console.log('Selfie upload successful');
          }
        } else {
          console.error('Failed to create blob from canvas');
          toast({
            title: "Selfie Capture Failed",
            description: "Unable to process the captured image. Please try again.",
            variant: "destructive"
          });
        }
        
        setShowCamera(false);
        
        // Stop camera stream
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing selfie:', error);
      toast({
        title: "Selfie Capture Failed",
        description: "Unable to capture selfie. Please try again.",
        variant: "destructive"
      });
      setShowCamera(false);
    }
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
