
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
    if (!driver) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to upload documents",
        variant: "destructive"
      });
      return null;
    }

    console.log(`Starting upload for ${type}:`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      driverPhone: driver.phone
    });

    setUploading(true);
    setUploads(prev => ({ ...prev, [type]: { type, file, status: 'pending' } }));

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${driver.user_id}/${type}_${Date.now()}.${fileExt}`;
      
      console.log(`Uploading to storage path: ${fileName}`);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('Storage upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Save document record to database
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .upsert({
          driver_phone_ref: driver.phone,
          type,
          file_url: publicUrl,
          status: 'pending',
          uploaded_at: new Date().toISOString()
        }, {
          onConflict: 'driver_phone_ref,type'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database save error:', dbError);
        throw dbError;
      }

      console.log('Database record saved:', dbData);

      setUploads(prev => ({ 
        ...prev, 
        [type]: { type, file, url: publicUrl, status: 'uploaded' } 
      }));

      console.log(`Upload completed successfully for ${type}`);
      return publicUrl;

    } catch (error) {
      console.error(`Upload failed for ${type}:`, error);
      
      setUploads(prev => ({ ...prev, [type]: { type, file, status: 'failed' } }));
      
      let errorMessage = "Failed to upload document";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Upload Failed",
        description: `${type}: ${errorMessage}`,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploads,
    uploading,
    uploadDocument
  };
};
