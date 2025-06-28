
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
    setCurrentUploadType(docKey);
    if (docKey === 'selfie') {
      setShowSelfieOptions(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleTakeLiveSelfie = () => {
    setShowSelfieOptions(false);
    setShowCamera(true);
  };

  const handleUploadSelfie = () => {
    setShowSelfieOptions(false);
    fileInputRef.current?.click();
  };

  const cancelCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, JPEG, or PNG files only",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive"
      });
      return false;
    }

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
