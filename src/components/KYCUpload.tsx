
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const [uploadedDocs, setUploadedDocs] = useState({
    nationalId: false,
    driverLicense: false,
    vehiclePhoto: false,
    ownership: false
  });

  const documents = [
    { key: 'nationalId', label: 'National ID or Passport', required: true },
    { key: 'driverLicense', label: "Driver's License", required: true },
    { key: 'vehiclePhoto', label: 'Vehicle Photo', required: true },
    { key: 'ownership', label: 'Proof of Car Ownership', required: true }
  ];

  const handleFileUpload = (docKey: string) => {
    // Simulate file upload
    setUploadedDocs(prev => ({ ...prev, [docKey]: true }));
  };

  const allDocsUploaded = Object.values(uploadedDocs).every(Boolean);

  const handleSubmit = () => {
    if (allDocsUploaded) {
      // Simulate approval process
      setTimeout(() => {
        onApproval();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Document Verification</CardTitle>
          <p className="text-gray-400">Upload required documents to get approved as a driver</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-900 border-blue-700">
            <AlertDescription className="text-blue-200">
              Please upload clear photos of all required documents. Processing typically takes 24-48 hours.
            </AlertDescription>
          </Alert>

          {documents.map((doc) => (
            <Card key={doc.key} className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {uploadedDocs[doc.key as keyof typeof uploadedDocs] ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="text-white font-medium">{doc.label}</div>
                      {doc.required && (
                        <div className="text-red-400 text-xs">Required</div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleFileUpload(doc.key)}
                    disabled={uploadedDocs[doc.key as keyof typeof uploadedDocs]}
                    className={
                      uploadedDocs[doc.key as keyof typeof uploadedDocs]
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }
                  >
                    {uploadedDocs[doc.key as keyof typeof uploadedDocs] ? 'Uploaded' : 'Upload'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            onClick={handleSubmit}
            disabled={!allDocsUploaded}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
          >
            Submit for Approval
          </Button>

          {allDocsUploaded && (
            <Alert className="bg-green-900 border-green-700">
              <AlertDescription className="text-green-200">
                All documents uploaded successfully! Click submit to send for review.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCUpload;
