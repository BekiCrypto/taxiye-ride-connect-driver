
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileCheck, Download, PenTool } from 'lucide-react';
import { Driver } from '@/types/driver';

interface ServiceAgreementStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const ServiceAgreementStep = ({ data, onChange, onNext, isLoading }: ServiceAgreementStepProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(data.service_agreement_signed || false);
  const [digitalSignature, setDigitalSignature] = useState('');

  const handleAgreementChange = (checked: boolean) => {
    setAgreedToTerms(checked);
    onChange({
      service_agreement_signed: checked,
      service_agreement_date: checked ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  const handleSignatureChange = (signature: string) => {
    setDigitalSignature(signature);
    onChange({ digital_signature_url: signature });
  };

  const isFormValid = () => {
    return agreedToTerms && digitalSignature.trim().length > 0;
  };

  const agreementText = `
TAXIYE PLATFORM SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into between Taxiye Platform ("Company") and the Driver ("You") for the provision of taxi dispatch services in accordance with EtASN Directive No. 05/2011.

KEY TERMS:
1. Duration: This agreement is valid for one (1) year from the date of signing.
2. Commission: The platform will retain a service commission as specified in the rate schedule.
3. Compliance: You agree to maintain all required licenses, insurance, and vehicle certifications.
4. Service Standards: You agree to provide professional, safe, and courteous service to all passengers.
5. Vehicle Standards: Your vehicle must meet all safety and cleanliness standards set by the platform.
6. Documentation: You must maintain current and valid driving license, vehicle insurance, and roadworthiness certificate.
7. Availability: You agree to be available for service requests when marked as "online" on the platform.
8. Payment: Earnings will be processed according to the platform's payment schedule.
9. Termination: Either party may terminate this agreement with 30 days written notice.
10. Regulatory Compliance: You acknowledge compliance with all Ethiopian transport regulations and EtASN directives.

By signing below, you acknowledge that you have read, understood, and agree to be bound by all terms of this Agreement.
  `;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileCheck className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Service Agreement</h3>
          </div>

          <Alert className="bg-blue-900/50 border-blue-700/50">
            <AlertDescription className="text-blue-200">
              As required by EtASN Directive No. 05/2011, all drivers must sign a one-year service agreement with the platform operator.
            </AlertDescription>
          </Alert>

          {/* Agreement Text */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4 max-h-64 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                {agreementText}
              </pre>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Full Agreement</span>
            </Button>
          </div>

          {/* Digital Signature */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PenTool className="h-4 w-4 text-blue-400" />
              <h4 className="text-white font-medium">Digital Signature</h4>
            </div>
            
            <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
              <input
                type="text"
                placeholder="Type your full name as digital signature"
                value={digitalSignature}
                onChange={(e) => handleSignatureChange(e.target.value)}
                className="w-full bg-transparent text-white text-center text-lg border-none outline-none"
                style={{ fontFamily: 'cursive' }}
              />
              <p className="text-gray-400 text-sm mt-2">
                Your typed name serves as your digital signature
              </p>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3 p-4 bg-gray-800 rounded-lg">
            <Checkbox
              id="agreement"
              checked={agreedToTerms}
              onCheckedChange={handleAgreementChange}
              className="mt-1"
            />
            <label htmlFor="agreement" className="text-gray-200 text-sm leading-relaxed cursor-pointer">
              I have read and agree to the terms and conditions of this Service Agreement. 
              I understand that this agreement is valid for one year and governs my relationship 
              with the Taxiye platform in accordance with EtASN regulations.
            </label>
          </div>

          <Alert className="bg-green-900/50 border-green-700/50">
            <AlertDescription className="text-green-200">
              Once signed, this agreement will be stored securely and made available for regulatory audit as required by EtASN.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end pt-4">
            <Button
              onClick={onNext}
              disabled={!isFormValid() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continue to Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceAgreementStep;
