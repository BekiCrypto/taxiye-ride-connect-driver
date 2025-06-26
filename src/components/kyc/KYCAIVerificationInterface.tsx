
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Eye } from 'lucide-react';

interface KYCAIVerificationInterfaceProps {
  verificationStep: 'init' | 'processing' | 'liveness' | 'complete';
  progress: number;
}

const KYCAIVerificationInterface = ({ verificationStep, progress }: KYCAIVerificationInterfaceProps) => {
  return (
    <div className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            verificationStep === 'liveness' ? 'bg-green-600' : 'bg-purple-600'
          } animate-pulse`}>
            {verificationStep === 'liveness' ? (
              <Eye className="h-8 w-8 text-white" />
            ) : (
              <Sparkles className="h-8 w-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {verificationStep === 'liveness' ? 'Liveness Check' : 'AI Verification'}
          </CardTitle>
          <p className="text-gray-400">
            {verificationStep === 'liveness' 
              ? 'Please look directly at your camera...'
              : 'AI is analyzing your documents...'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {verificationStep === 'liveness' && (
            <div className="flex justify-center">
              <div className="w-32 h-32 border-4 border-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Eye className="h-16 w-16 text-green-400" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCAIVerificationInterface;
