
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Driver } from '@/types/driver';
import { fetchDriverProfile, updateDriverProfile } from '@/services/driverService';

export const useDriverAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      console.log('Getting initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setUser(null);
            setDriver(null);
            setLoading(false);
          }
          return;
        }
        
        console.log('Initial session found:', !!session?.user);
        
        if (isMounted) {
          if (session?.user) {
            setUser(session.user);
            // Try to fetch driver profile, but don't let it hang the app
            await handleFetchDriverProfile(session.user.id);
          } else {
            setUser(null);
            setDriver(null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Unexpected error getting session:', err);
        if (isMounted) {
          setUser(null);
          setDriver(null);
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session?.user);
      
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        // Try to fetch driver profile, but always resolve loading
        await handleFetchDriverProfile(session.user.id);
      } else {
        setUser(null);
        setDriver(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleFetchDriverProfile = async (userId: string) => {
    try {
      console.log('Fetching driver profile for user:', userId);
      const driverData = await fetchDriverProfile(userId);
      console.log('Driver profile result:', driverData ? 'Found' : 'Not found');
      
      // Always set the driver data (null if no profile exists)
      setDriver(driverData);
    } catch (err) {
      console.error('Error fetching driver profile:', err);
      // Ensure we set null on error
      setDriver(null);
    } finally {
      // ALWAYS set loading to false to prevent infinite loading
      console.log('Setting loading to false - profile fetch complete');
      setLoading(false);
    }
  };

  const handleUpdateDriverProfile = async (updates: Partial<Omit<Driver, 'phone' | 'user_id'>>) => {
    if (!driver) return null;

    const updatedDriver = await updateDriverProfile(driver.phone, updates);
    if (updatedDriver) {
      setDriver(updatedDriver);
    }
    return updatedDriver;
  };

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
  };

  return {
    user,
    driver,
    loading,
    updateDriverProfile: handleUpdateDriverProfile,
    fetchDriverProfile: () => user ? handleFetchDriverProfile(user.id) : null,
    signOut
  };
};
