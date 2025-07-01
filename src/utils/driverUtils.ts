
import { Driver } from '@/types/driver';

export const mapDriverData = (data: any): Driver => {
  return {
    phone: data.phone,
    user_id: data.user_id,
    name: data.name,
    email: data.email,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    profile_photo_url: data.profile_photo_url,
    national_id_number: data.national_id_number,
    license_number: data.license_number,
    license_expiry_date: data.license_expiry_date,
    vehicle_make: data.vehicle_make,
    vehicle_model: data.vehicle_model,
    vehicle_year: data.vehicle_year,
    vehicle_color: data.vehicle_color,
    plate_number: data.plate_number,
    insurance_expiry_date: data.insurance_expiry_date,
    roadworthiness_expiry_date: data.roadworthiness_expiry_date,
    service_agreement_signed: data.service_agreement_signed || false,
    service_agreement_date: data.service_agreement_date,
    digital_signature_url: data.digital_signature_url,
    registration_step: data.registration_step || 1,
    is_registration_complete: data.is_registration_complete || false,
    approved_status: (data.approved_status as 'pending' | 'approved' | 'rejected') || 'pending',
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
