
export interface Driver {
  phone: string; // Primary key in the database
  user_id: string;
  name: string;
  email?: string;
  
  // Personal Information (Step 1)
  gender?: string;
  date_of_birth?: string;
  profile_photo_url?: string;
  national_id_number?: string;
  
  // License Information (Step 2)
  license_number?: string;
  license_expiry_date?: string;
  
  // Vehicle Information (Step 3)
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_color?: string;
  plate_number?: string;
  insurance_expiry_date?: string;
  roadworthiness_expiry_date?: string;
  
  // Service Agreement (Step 4)
  service_agreement_signed?: boolean;
  service_agreement_date?: string;
  digital_signature_url?: string;
  
  // Registration Progress
  registration_step: number;
  is_registration_complete: boolean;
  
  // Approval Status
  approved_status: 'pending' | 'approved' | 'rejected';
  wallet_balance: number;
  is_online: boolean;
  created_at: string | null;
  updated_at: string | null;
  rejection_reason?: string;
  admin_notes?: string;
  last_reviewed_at?: string;
  reviewed_by?: string;
}

export interface DocumentExpiryNotification {
  id: string;
  driver_phone_ref: string;
  document_type: 'license' | 'insurance' | 'roadworthiness';
  expiry_date: string;
  notification_sent_30_days: boolean;
  notification_sent_7_days: boolean;
  notification_sent_on_expiry: boolean;
  last_notification_sent?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceAuditLog {
  id: string;
  driver_phone_ref: string;
  action_type: 'registration' | 'document_upload' | 'expiry_notification' | 'approval' | 'rejection';
  action_details: Record<string, any>;
  performed_by: string;
  created_at: string;
}

export interface ServiceAgreement {
  id: string;
  driver_phone_ref: string;
  agreement_version: string;
  signed_date: string;
  digital_signature_url?: string;
  agreement_document_url?: string;
  is_active: boolean;
  created_at: string;
}
