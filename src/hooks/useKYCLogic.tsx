
import { useState, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

export const useKYCLogic = () => {
  const [currentUploadType, setCurrentUploadType] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [showSelfieOptions, setShowSelfieOptions] = useState(false);
  const [showAIVerification, setShowAIVerification] = useState(false);
  const [submittingForReview, setSubmittingForReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (docKey: string) => {
    console.log(`Initiating upload for document type: ${docKey}`);
    setCurrentUploadType(docKey);
    if (docKey === 'selfie') {
      setShowSelfieOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleTakeLiveSelfie = () => {
    console.log('User chose to take live selfie');
    setShowSelfieOptions(false);
    setShowCamera(true);
  };

  const handleUploadSelfie = () => {
    console.log('User chose to upload existing selfie');
    setShowSelfieOptions(false);
    fileInputRef.current?.click();
  };

  const cancelCamera = () => {
    console.log('Cancelling camera interface');
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };

  const validateFile = (file: File): boolean => {
    console.log('Validating file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // More comprehensive file type validation
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    
    const allowedExtensions = ['pdf', 'jpeg', 'jpg', 'png'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      toast({
        title: "Invalid File Type ❌",
        description: "Please upload PDF, JPEG, or PNG files only",
        variant: "destructive"
      });
      return false;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large ❌",
        description: "Please upload files smaller than 10MB",
        variant: "destructive"
      });
      return false;
    }

    // Check minimum file size (1KB to avoid empty files)
    if (file.size < 1024) {
      toast({
        title: "File Too Small ❌",
        description: "File appears to be empty or corrupted. Please select a valid file.",
        variant: "destructive"
      });
      return false;
    }

    console.log('File validation passed');
    return true;
  };

  return {
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
  };
};
