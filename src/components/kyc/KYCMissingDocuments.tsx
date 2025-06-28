
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Document {
  key: string;
  label: string;
  required: boolean;
  formats: string;
}

interface KYCMissingDocumentsProps {
  missingDocs: Document[];
}

const KYCMissingDocuments = ({ missingDocs }: KYCMissingDocumentsProps) => {
  if (missingDocs.length === 0) return null;

  return (
    <Alert className="bg-orange-900/50 border-orange-700/50">
      <AlertDescription className="text-orange-200">
        <div className="font-medium mb-1">Missing Documents ({missingDocs.length}):</div>
        <ul className="list-disc list-inside text-sm">
          {missingDocs.map(doc => (
            <li key={doc.key}>{doc.label}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default KYCMissingDocuments;
