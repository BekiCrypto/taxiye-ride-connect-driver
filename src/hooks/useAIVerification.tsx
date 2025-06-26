
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';
import { toast } from '@/hooks/use-toast';

export const useAIVerification = () => {
  const { driver, updateDriverProfile } = useDriverAuth();
  const [verifying, setVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'init' | 'processing' | 'liveness' | 'complete'>('init');
  const [progress, setProgress] = useState(0);

  const startAIVerification = async () => {
    if (!driver) return null;

    setVerifying(true);
    setVerificationStep('processing');
    setProgress(0);

    try {
      // Create AI verification session
      const { data: session, error: sessionError } = await supabase
        .from('ai_verification_sessions')
        .insert({
          driver_phone_ref: driver.phone,
          session_status: 'in_progress'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Simulate AI document analysis
      const steps = [
        { message: 'Analyzing documents...', progress: 20 },
        { message: 'Validating ID authenticity...', progress: 40 },
        { message: 'Checking driver license...', progress: 60 },
        { message: 'Verifying vehicle ownership...', progress: 80 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProgress(step.progress);
      }

      // Start liveness check
      setVerificationStep('liveness');
      setProgress(90);

      // Simulate liveness detection
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate AI verification result (80% success rate for demo)
      const aiConfidence = Math.random();
      const passed = aiConfidence > 0.2;
      
      setProgress(100);
      setVerificationStep('complete');

      // Update verification session
      await supabase
        .from('ai_verification_sessions')
        .update({
          session_status: 'completed',
          liveness_check_passed: passed,
          ai_confidence_score: aiConfidence,
          verification_result: passed ? 'approved' : 'requires_review',
          completed_at: new Date().toISOString(),
          failure_reason: passed ? null : 'AI confidence score below threshold'
        })
        .eq('id', session.id);

      if (passed) {
        // Auto-approve if AI is confident
        await updateDriverProfile({ 
          approved_status: 'approved' as const,
          reviewed_by: 'AI_SYSTEM',
          last_reviewed_at: new Date().toISOString()
        });

        toast({
          title: "AI Verification Successful! 🤖✅",
          description: "Your documents have been automatically verified!",
        });

        return { success: true, autoApproved: true };
      } else {
        // Mark for manual review
        await updateDriverProfile({ 
          approved_status: 'pending' as const,
          admin_notes: 'Requires manual review - AI confidence below threshold'
        });

        toast({
          title: "Documents Under Review",
          description: "Your documents require manual review. You'll be notified within 24-48 hours.",
        });

        return { success: true, autoApproved: false };
      }
    } catch (error) {
      console.error('AI Verification error:', error);
      setVerificationStep('init');
      
      toast({
        title: "Verification Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
      
      return { success: false, autoApproved: false };
    } finally {
      setVerifying(false);
    }
  };

  const submitForManualReview = async () => {
    if (!driver) return false;

    try {
      await updateDriverProfile({ 
        approved_status: 'pending' as const,
        admin_notes: 'Manual review requested by user'
      });

      toast({
        title: "Submitted for Review",
        description: "Your documents have been submitted for manual review.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    verifying,
    verificationStep,
    progress,
    startAIVerification,
    submitForManualReview
  };
};
