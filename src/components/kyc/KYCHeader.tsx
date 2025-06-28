
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, LogOut } from 'lucide-react';

interface KYCHeaderProps {
  onSignOut: () => void;
}

const KYCHeader = ({ onSignOut }: KYCHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <div className="flex items-center justify-between mb-4">
        <div className="mx-auto">
          <img 
            src="https://cmsprod.taxiye.com/uploads/taxiye_logo_main_09d8b73c2f.svg" 
            alt="Taxiye Logo" 
            className="h-12 w-auto mx-auto"
          />
        </div>
        <Button
          onClick={onSignOut}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4">
        <FileText className="h-10 w-10 text-white" />
      </div>
      <CardTitle className="text-2xl font-bold text-white">Document Verification</CardTitle>
      <p className="text-gray-400">
        Please upload clear photos/PDFs of all required documents
      </p>
    </CardHeader>
  );
};

export default KYCHeader;
