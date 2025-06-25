
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Driver {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  license_number?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  plate_number?: string;
  approved_status: 'pending' | 'approved' | 'rejected';
  wallet_balance: number;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

export const useDriverAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchDriverProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchDriverProfile(session.user.id);
      } else {
        setDriver(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDriverProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching driver profile:', error);
    } else if (data) {
      // Cast the data to ensure proper typing
      const driverData: Driver = {
        ...data,
        approved_status: data.approved_status as 'pending' | 'approved' | 'rejected',
        wallet_balance: Number(data.wallet_balance)
      };
      setDriver(driverData);
    }
  };

  const updateDriverProfile = async (updates: Partial<Driver>) => {
    if (!driver) return null;

    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', driver.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating driver profile:', error);
      return null;
    }

    if (data) {
      const updatedDriver: Driver = {
        ...data,
        approved_status: data.approved_status as 'pending' | 'approved' | 'rejected',
        wallet_balance: Number(data.wallet_balance)
      };
      setDriver(updatedDriver);
      return updatedDriver;
    }

    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    driver,
    loading,
    updateDriverProfile,
    fetchDriverProfile: () => user ? fetchDriverProfile(user.id) : null,
    signOut
  };
};
