
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, PenTool } from 'lucide-react';
import { Driver } from '@/types/driver';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

interface ServiceAgreementStepProps {
  data: Partial<Driver>;
  onChange: (data: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const ServiceAgreementStep = ({ data, onChange, onNext, isLoading }: ServiceAgreementStepProps) => {
  const { uploadDocument } = useDocumentUpload();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!data.digital_signature_url);
  const [uploading, setUploading] = useState(false);

  const agreementContent = `
ELECTRONIC TAXI DISPATCH SYSTEM (ETDS) SERVICE AGREEMENT
Directive Compliant

This Service Agreement ("Agreement") is entered into between the Driver and ETDS Platform, in compliance with applicable taxi dispatch regulations and directives.

1. REGULATORY COMPLIANCE
- Driver acknowledges compliance with all applicable taxi dispatch directives
- Vehicle must maintain valid insurance, roadworthiness, and driver licensing
- Driver agrees to maintain compliance with Electronic Taxi Dispatch System regulations

2. SERVICE OBLIGATIONS
- Provide safe, reliable transportation service
- Maintain professional conduct with passengers
- Comply with fare structures and payment processing
- Respond to dispatch requests in timely manner

3. VEHICLE AND DOCUMENTATION REQUIREMENTS
- Valid driving license with appropriate endorsements
- Current vehicle insurance and roadworthiness certificates
- Vehicle must meet ETDS platform standards
- Regular document renewals as required by regulation

4. PLATFORM USAGE
- Use only approved ETDS mobile application
- Maintain accurate location and availability status
- Follow prescribed route optimization when applicable
- Comply with platform's quality standards

5. FINANCIAL TERMS
- Commission structure as outlined in platform guidelines
- Payment processing through approved channels
- Transparent fare calculation and receipt provision
- Compliance with tax obligations

6. DATA PROTECTION & PRIVACY
- Protection of passenger personal information
- Compliance with data protection regulations
- Secure handling of payment information
- Respect for passenger privacy rights

7. TERMINATION PROVISIONS
- Either party may terminate with appropriate notice
- Compliance with final obligation settlements
- Return of platform equipment if applicable

By signing below, Driver acknowledges understanding and agreement to comply with all terms and applicable ETDS directives.
  `;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const stopDrawing = async () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to blob and upload
    canvas.toBlob(async (blob) => {
      if (blob) {
        setUploading(true);
        try {
          const file = new File([blob], 'signature.png', { type: 'image/png' });
          const url = await uploadDocument('digital_signature', file);
          if (url) {
            onChange({
              digital_signature_url: url,
              service_agreement_date: new Date().toISOString().split('T')[0]
            });
            setHasSignature(true);
          }
        } finally {
          setUploading(false);
        }
      }
    });
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    onChange({ digital_signature_url: undefined });
  };

  const downloadAgreement = () => {
    const element = document.createElement('a');
    const file = new Blob([agreementContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'ETDS_Service_Agreement.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const isFormValid = () => {
    return data.service_agreement_signed && hasSignature;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">ETDS Service Agreement</h3>
          </div>

          <Alert className="bg-blue-900/50 border-blue-700/50">
            <AlertDescription className="text-blue-200">
              Please review the Electronic Taxi Dispatch System Service Agreement carefully. This agreement ensures compliance with applicable directives and regulations.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
              {agreementContent}
            </pre>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={downloadAgreement}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Agreement</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreement"
              checked={data.service_agreement_signed || false}
              onCheckedChange={(checked) => 
                onChange({ service_agreement_signed: checked as boolean })
              }
            />
            <label htmlFor="agreement" className="text-gray-200 text-sm">
              I have read, understood, and agree to the ETDS Service Agreement and all applicable directives
            </label>
          </div>

          {data.service_agreement_signed && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <PenTool className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">Digital Signature Required</span>
              </div>

              <div className="border-2 border-gray-600 rounded-lg p-4 bg-white">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={150}
                  className="w-full h-32 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={clearSignature}
                  disabled={uploading}
                >
                  Clear Signature
                </Button>
                {uploading && (
                  <span className="text-blue-400 text-sm">Saving signature...</span>
                )}
              </div>

              {hasSignature && (
                <Alert className="bg-green-900/50 border-green-700/50">
                  <AlertDescription className="text-green-200">
                    Digital signature captured successfully.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

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
