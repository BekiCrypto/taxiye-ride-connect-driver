
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface KYCUploadProps {
  onApproval: () => void;
}

const KYCUpload = ({ onApproval }: KYCUploadProps) => {
  const [documents, setDocuments] = useState({
    nationalId: { file: null, status: 'pending' },
    driverLicense: { file: null, status: 'pending' },
    vehiclePhoto: { file: null, status: 'pending' },
    ownership: { file: null, status: 'pending' }
  });

  const documentTypes = [
    { key: 'nationalId', label: 'National ID / Passport', icon: '🆔' },
    { key: 'driverLicense', label: 'Driver\'s License', icon: '🚗' },
    { key: 'vehiclePhoto', label: 'Vehicle Photo', icon: '📸' },
    { key: 'ownership', label: 'Proof of Ownership', icon: '📄' }
  ];

  const handleFileUpload = (docType: string, file: File) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: { file, status: 'uploaded' }
    }));
  };

  const handleSubmit = () => {
    // Simulate document review process
    setTimeout(() => {
      onApproval();
    }, 2000);
  };

  const allDocumentsUploaded = Object.values(documents).every(doc => doc.file !== null);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Document Verification</CardTitle>
            <p className="text-gray-400">Upload required documents to complete your driver registration</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {documentTypes.map((docType) => (
              <div key={docType.key} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{docType.icon}</span>
                    <span className="text-white font-medium">{docType.label}</span>
                  </div>
                  {documents[docType.key as keyof typeof documents].status === 'uploaded' && (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                </div>
                
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(docType.key, file);
                    }
                  }}
                  className="bg-gray-600 border-gray-500 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded"
                />
              </div>
            ))}

            <div className="bg-blue-800 border border-blue-600 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-100">
                  <p className="font-medium mb-1">Important Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Documents must be clear and readable</li>
                    <li>Photos should be well-lit with no shadows</li>
                    <li>All information must be clearly visible</li>
                    <li>Files should be in JPG, PNG, or PDF format</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!allDocumentsUploaded}
            >
              <Upload className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>

            {allDocumentsUploaded && (
              <div className="bg-green-800 border border-green-600 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-green-100 font-medium">Review in Progress</p>
                <p className="text-green-200 text-sm">Your documents are being reviewed. This usually takes 24-48 hours.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KYCUpload;
