
import { Driver } from '@/types/driver';

export const mapDriverData = (data: any): Driver => {
  return {
    phone: data.phone,
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
