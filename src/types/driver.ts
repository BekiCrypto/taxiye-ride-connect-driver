
export interface Driver {
  phone: string; // Primary key in the database
  user_id: string;
  name: string;
  email?: string;
  license_number?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  plate_number?: string;
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
