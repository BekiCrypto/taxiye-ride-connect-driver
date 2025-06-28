
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
  const { user, driver } = useDriverAuth();
  const [uploads, setUploads] = useState<Record<string, DocumentUpload>>({});
  const [uploading, setUploading] = useState(false);

  const uploadDocument = async (type: string, file: File): Promise<string | null> => {
    // Check for authenticated user instead of driver profile
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to upload documents",
        variant: "destructive"
      });
      return null;
    }

    // If no driver profile exists yet, we'll use the user_id for the file path
    const phoneRef = driver?.phone || `user_${user.id}`;

    console.log(`Starting upload for ${type}:`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      userAuthenticated: !!user,
      driverExists: !!driver,
      phoneRef
    });

    setUploading(true);
    setUploads(prev => ({ ...prev, [type]: { type, file, status: 'pending' } }));

    try {
      // Validate file
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, JPEG, or PNG files only.');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File too large. Please upload files smaller than 10MB.');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      
      console.log(`Uploading to storage path: ${fileName}`);

      // Upload to Supabase Storage with proper configuration
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('Storage upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Verify the URL is accessible
      if (!publicUrl) {
        throw new Error('Failed to generate public URL for uploaded file');
      }

      // Save document record to database with error handling
      // Use phoneRef which could be driver phone or user_id based fallback
      const { data: dbData, error: dbError } = await supabase
        .from('documents')
        .upsert({
          driver_phone_ref: phoneRef,
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
        // Don't throw here - the file was uploaded successfully
        console.warn('File uploaded but database record may not have been saved properly');
      } else {
        console.log('Database record saved successfully:', dbData);
      }

      setUploads(prev => ({ 
        ...prev, 
        [type]: { type, file, url: publicUrl, status: 'uploaded' } 
      }));

      toast({
        title: "Upload Successful! ✅",
        description: `${type.replace('_', ' ').toUpperCase()} uploaded successfully`,
      });

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
        title: "Upload Failed ❌",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = (type: string) => {
    setUploads(prev => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
  };

  return {
    uploads,
    uploading,
    uploadDocument,
    resetUpload
  };
};
