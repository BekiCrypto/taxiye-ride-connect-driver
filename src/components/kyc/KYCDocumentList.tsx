
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, Camera } from 'lucide-react';

interface DocumentUpload {
  type: string;
  file?: File;
  url?: string;
  status: 'pending' | 'uploaded' | 'failed';
}

interface Document {
  key: string;
  label: string;
  required: boolean;
  formats: string;
}

interface KYCDocumentListProps {
  documents: Document[];
  uploads: Record<string, DocumentUpload>;
  uploading: boolean;
  currentUploadType: string;
  onUpload: (docKey: string) => void;
}

const KYCDocumentList = ({ 
  documents, 
  uploads, 
  uploading, 
  currentUploadType, 
  onUpload 
}: KYCDocumentListProps) => {
  return (
    <>
      {documents.map((doc) => (
        <Card key={doc.key} className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {uploads[doc.key]?.status === 'uploaded' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : doc.key === 'selfie' ? (
                  <Camera className="h-5 w-5 text-gray-400" />
                ) : (
                  <Upload className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <div className="text-white font-medium">{doc.label}</div>
                  <div className="text-xs text-gray-400">{doc.formats}</div>
                  {doc.required && (
                    <Badge variant="destructive" className="text-xs mt-1">Required</Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => onUpload(doc.key)}
                disabled={uploads[doc.key]?.status === 'uploaded' || uploading}
                className={
                  uploads[doc.key]?.status === 'uploaded'
                    ? 'bg-green-600 text-white'
                    : doc.key === 'selfie'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              >
                {uploads[doc.key]?.status === 'uploaded' 
                  ? 'Uploaded' 
                  : doc.key === 'selfie' 
                  ? 'Take Selfie' 
                  : uploading && currentUploadType === doc.key
                  ? 'Uploading...'
                  : 'Upload'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default KYCDocumentList;
