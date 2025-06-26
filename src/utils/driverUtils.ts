
import { Driver } from '@/types/driver';

export const mapDriverData = (data: any): Driver => {
  return {
    phone: data.phone, // This will now include the DRV_ prefix if needed
    user_id: data.user_id,
    name: data.name,
    email: data.email,
    license_number: data.license_number,
    vehicle_model: data.vehicle_model,
    vehicle_color: data.vehicle_color,
    plate_number: data.plate_number,
    approved_status: data.approved_status as 'pending' | 'approved' | 'rejected',
    wallet_balance: Number(data.wallet_balance || 0),
    is_online: data.is_online || false,
    created_at: data.created_at,
    updated_at: data.updated_at,
    rejection_reason: data.rejection_reason,
    admin_notes: data.admin_notes,
    last_reviewed_at: data.last_reviewed_at,
    reviewed_by: data.reviewed_by
  };
};

// Helper function to extract clean phone number for display
export const getDisplayPhone = (phone: string): string => {
  if (phone.startsWith('DRV_')) {
    return phone.substring(4);
  }
  if (phone.startsWith('PSG_')) {
    return phone.substring(4);
  }
  return phone;
};

// Helper function to check if phone is a driver phone
export const isDriverPhone = (phone: string): boolean => {
  return phone.startsWith('DRV_');
};

// Helper function to check if phone is a passenger phone
export const isPassengerPhone = (phone: string): boolean => {
  return phone.startsWith('PSG_');
};
