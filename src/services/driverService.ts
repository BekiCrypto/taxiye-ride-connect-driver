
import { supabase } from '@/integrations/supabase/client';
import { Driver } from '@/types/driver';
import { mapDriverData } from '@/utils/driverUtils';

export const fetchDriverProfile = async (userId: string): Promise<Driver | null> => {
  console.log('Fetching driver profile for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching driver profile:', error);
      // Return null instead of throwing to allow the app to continue
      return null;
    }

    if (data) {
      console.log('Driver profile found:', data);
      const driverData = mapDriverData(data);
      console.log('Driver status:', driverData.approved_status);
      return driverData;
    } else {
      console.log('No driver profile found for user:', userId);
      // This is expected after database clear - return null cleanly
      return null;
    }
  } catch (err) {
    console.error('Unexpected error fetching driver profile:', err);
    // Always return null to prevent app hanging
    return null;
  }
};

export const updateDriverProfile = async (
  driverPhone: string, 
  updates: Partial<Omit<Driver, 'phone' | 'user_id'>>
): Promise<Driver | null> => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('phone', driverPhone)
      .select()
      .single();

    if (error) {
      console.error('Error updating driver profile:', error);
      return null;
    }

    if (data) {
      return mapDriverData(data);
    }
  } catch (err) {
    console.error('Unexpected error updating driver profile:', err);
  }

  return null;
};
