
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
      console.log('Getting initial session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log('Initial session:', !!session?.user);
      }
      
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchDriverProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session?.user);
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
    console.log('Fetching driver profile for user:', userId);
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching driver profile:', error);
      setDriver(null);
    } else if (data) {
      console.log('Driver profile fetched:', data);
      // Cast the data to ensure proper typing
      const driverData: Driver = {
        ...data,
        approved_status: data.approved_status as 'pending' | 'approved' | 'rejected',
        wallet_balance: Number(data.wallet_balance)
      };
      setDriver(driverData);
    } else {
      console.log('No driver profile found');
      setDriver(null);
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
    console.log('Signing out...');
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
