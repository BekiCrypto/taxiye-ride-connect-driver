
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { toast } from '@/hooks/use-toast';
import { Driver } from '@/types/driver';
import PersonalInfoStep from './steps/PersonalInfoStep';
import LicenseInfoStep from './steps/LicenseInfoStep';
import VehicleInfoStep from './steps/VehicleInfoStep';
import ServiceAgreementStep from './steps/ServiceAgreementStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';

interface MultiStepRegistrationProps {
  onComplete: () => void;
}

interface StepComponent {
  data: Partial<Driver>;
  onChange: (stepData: Partial<Driver>) => void;
  onNext: () => void;
  isLoading: boolean;
}

const steps = [
  { id: 1, title: 'Personal Information', component: PersonalInfoStep },
  { id: 2, title: 'License Details', component: LicenseInfoStep },
  { id: 3, title: 'Vehicle Information', component: VehicleInfoStep },
  { id: 4, title: 'Service Agreement', component: ServiceAgreementStep },
  { id: 5, title: 'Review & Submit', component: ReviewSubmitStep }
];

const MultiStepRegistration = ({ onComplete }: MultiStepRegistrationProps) => {
  const { driver, updateDriverProfile } = useDriverAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Driver>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      setCurrentStep(driver.registration_step || 1);
      setFormData(driver);
    }
  }, [driver]);

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setIsLoading(true);
      try {
        // Save progress to database
        const updatedData = {
          ...formData,
          registration_step: currentStep + 1
        };
        
        await updateDriverProfile(updatedData);
        setCurrentStep(currentStep + 1);
        setFormData(updatedData);
        
        toast({
          title: "Progress Saved",
          description: `Step ${currentStep} completed successfully`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save progress. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepDataChange = (stepData: Partial<Driver>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      const finalData = {
        ...formData,
        is_registration_complete: true,
        registration_step: 5,
        approved_status: 'pending' as const
      };
      
      await updateDriverProfile(finalData);
      
      toast({
        title: "Registration Complete! ✅",
        description: "Your application has been submitted for review."
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps.find(step => step.id === currentStep);
  const StepComponent = currentStepData?.component;

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Driver Registration - EtASN Compliant
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
              <p className="text-center text-gray-300">{currentStepData?.title}</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {StepComponent && (
              <StepComponent
                data={formData}
                onChange={handleStepDataChange}
                onNext={currentStep === steps.length ? handleFinalSubmit : handleNext}
                isLoading={isLoading}
              />
            )}
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex space-x-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full ${
                      step.id === currentStep
                        ? 'bg-blue-500'
                        : step.id < currentStep
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={currentStep === steps.length ? handleFinalSubmit : handleNext}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <span>{currentStep === steps.length ? 'Submit Application' : 'Next'}</span>
                {currentStep < steps.length && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiStepRegistration;
