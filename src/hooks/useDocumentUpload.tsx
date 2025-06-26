
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';
import { toast } from '@/hooks/use-toast';

export interface DocumentUpload {
  type: string;
  file?: File;
  url?: string;
  status: 'pending' | 'uploaded' | 'failed';
}

export const useDocumentUpload = () => {
  const { driver } = useDriverAuth();
  const [uploads, setUploads] = useState<Record<string, DocumentUpload>>({});
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (type: string, file: File): Promise<string | null> => {
    if (!driver) return null;

    setUploading(true);
    setUploads(prev => ({ ...prev, [type]: { type, file, status: 'pending' } }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${driver.user_id}/${type}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save document record to database
      const { error: dbError } = await supabase
        .from('documents')
        .upsert({
          driver_phone_ref: driver.phone,
          type,
          file_url: publicUrl,
          status: 'pending'
        });

      if (dbError) throw dbError;

      setUploads(prev => ({ 
        ...prev, 
        [type]: { type, file, url: publicUrl, status: 'uploaded' } 
      }));

      toast({
        title: "Document Uploaded",
        description: `${type} uploaded successfully`,
      });

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      setUploads(prev => ({ ...prev, [type]: { type, file, status: 'failed' } }));
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  const capturePhoto = async (type: string): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          setTimeout(() => {
            context?.drawImage(video, 0, 0);
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], `${type}.jpg`, { type: 'image/jpeg' });
                const url = await uploadDocument(type, file);
                resolve(url);
              }
              stream.getTracks().forEach(track => track.stop());
            }, 'image/jpeg', 0.8);
          }, 1000);
        };
      });
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take a selfie",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    uploads,
    uploading,
    uploadDocument,
    capturePhoto
  };
};
