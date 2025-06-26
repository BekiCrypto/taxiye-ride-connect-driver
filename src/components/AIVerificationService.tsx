
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Eye, 
  FileCheck, 
  UserCheck, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface AIVerificationServiceProps {
  onBack: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

const AIVerificationService = ({ onBack, onSuccess, onFailure }: AIVerificationServiceProps) => {
  const [verificationStep, setVerificationStep] = useState<'intro' | 'processing' | 'liveness' | 'result'>('intro');
  const [progress, setProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failure' | null>(null);

  const startVerification = async () => {
    setVerificationStep('processing');
    setProgress(0);

    // Simulate AI verification steps
    const steps = [
      { message: 'Analyzing documents...', progress: 20 },
      { message: 'Validating ID authenticity...', progress: 40 },
      { message: 'Checking driver license...', progress: 60 },
      { message: 'Verifying vehicle ownership...', progress: 80 },
      { message: 'Starting liveness check...', progress: 90 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step.progress);
    }

    // Move to liveness check
    setVerificationStep('liveness');
    
    // Simulate liveness check
    setTimeout(() => {
      setProgress(100);
      const success = Math.random() > 0.2; // 80% success rate
      setVerificationResult(success ? 'success' : 'failure');
      setVerificationStep('result');
      
      setTimeout(() => {
        if (success) {
          onSuccess();
        } else {
          onFailure();
        }
      }, 2000);
    }, 3000);
  };

  const renderIntro = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">AI-Assisted Verification</CardTitle>
        <p className="text-gray-400">Get verified instantly with our advanced AI technology</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-blue-900/50 border-blue-700/50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-blue-200">
            Our AI will verify your documents and conduct a liveness check to ensure security and authenticity.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
            <FileCheck className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-white font-medium">Document Analysis</div>
              <div className="text-xs text-gray-400">AI validates authenticity and extracts information</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
            <Eye className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-white font-medium">Liveness Detection</div>
              <div className="text-xs text-gray-400">Ensures you're a real person, not a photo</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
            <UserCheck className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-white font-medium">Identity Verification</div>
              <div className="text-xs text-gray-400">Cross-references all documents for consistency</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={startVerification}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start AI Verification
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Button>
        </div>
      </CardContent>
    </>
  );

  const renderProcessing = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Analyzing Documents</CardTitle>
        <p className="text-gray-400">AI is processing your uploaded documents...</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Verification Progress</span>
            <span className="text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Processing documents with advanced AI algorithms...</span>
          </div>
        </div>
      </CardContent>
    </>
  );

  const renderLiveness = () => (
    <>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Eye className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Liveness Check</CardTitle>
        <p className="text-gray-400">Verifying that you're a real person...</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-green-900/50 border-green-700/50">
          <Eye className="h-4 w-4" />
          <AlertDescription className="text-green-200">
            Please look directly at your camera. Our AI is analyzing your facial features and movements.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <div className="w-32 h-32 border-4 border-green-500 rounded-full flex items-center justify-center animate-pulse">
            <Eye className="h-16 w-16 text-green-400" />
          </div>
        </div>

        <div className="text-center">
          <div className="text-white font-medium">Stay still and look at the camera</div>
          <div className="text-xs text-gray-400 mt-1">This helps us verify your identity securely</div>
        </div>
      </CardContent>
    </>
  );

  const renderResult = () => (
    <>
      <CardHeader className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          verificationResult === 'success' 
            ? 'bg-green-600' 
            : 'bg-red-600'
        }`}>
          {verificationResult === 'success' ? (
            <CheckCircle className="h-8 w-8 text-white" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-white" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          {verificationResult === 'success' ? 'Verification Successful!' : 'Verification Failed'}
        </CardTitle>
        <p className="text-gray-400">
          {verificationResult === 'success' 
            ? 'Your documents and identity have been verified successfully'
            : 'Some documents require manual review by our team'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={verificationResult === 'success' ? 'bg-green-900/50 border-green-700/50' : 'bg-red-900/50 border-red-700/50'}>
          <AlertDescription className={verificationResult === 'success' ? 'text-green-200' : 'text-red-200'}>
            {verificationResult === 'success' 
              ? 'You can now start driving and earning with Taxiye!'
              : 'Don\'t worry - our team will review your documents within 24-48 hours.'
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        {verificationStep === 'intro' && renderIntro()}
        {verificationStep === 'processing' && renderProcessing()}
        {verificationStep === 'liveness' && renderLiveness()}
        {verificationStep === 'result' && renderResult()}
      </Card>
    </div>
  );
};

export default AIVerificationService;
