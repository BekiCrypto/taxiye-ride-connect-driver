
import { toast } from '@/components/ui/use-toast';

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendOTPToEmail = async (emailAddress: string, otpCode: string) => {
  console.log(`Sending OTP ${otpCode} to email: ${emailAddress}`);
  toast({
    title: "Email OTP Sent",
    description: `OTP ${otpCode} sent to ${emailAddress} (simulated)`,
  });
};

export const sendOTPToSMS = async (phoneNumber: string, otpCode: string) => {
  console.log(`Sending OTP ${otpCode} to phone: ${phoneNumber}`);
  toast({
    title: "SMS OTP Sent", 
    description: `OTP ${otpCode} sent to ${phoneNumber} (simulated)`,
  });
};
