
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Driver } from '@/types/driver';
import { fetchDriverProfile, updateDriverProfile } from '@/services/driverService';

export const useDriverAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    mountedRef.current = true;

    // Get initial session with timeout
    const getInitialSession = async () => {
      console.log('Getting initial session...');
      try {
        // Add timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
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
            // Fetch driver profile with timeout protection
            await handleFetchDriverProfile(session.user.id);
          } else {
            setUser(null);
            setDriver(null);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Session fetch error or timeout:', err);
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
        // Only fetch driver profile if we're not already fetching
        if (!fetchingRef.current) {
          await handleFetchDriverProfile(session.user.id);
        }
      } else {
        setUser(null);
        setDriver(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleFetchDriverProfile = async (userId: string) => {
    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) {
      console.log('Driver profile fetch already in progress, skipping...');
      return;
    }

    fetchingRef.current = true;

    try {
      console.log('Fetching driver profile for user:', userId);
      
      // Add timeout protection for driver profile fetch
      const profilePromise = fetchDriverProfile(userId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Driver profile fetch timeout')), 8000)
      );
      
      const driverData = await Promise.race([profilePromise, timeoutPromise]) as Driver | null;
      console.log('Driver profile result:', driverData ? 'Found' : 'Not found');
      
      if (mountedRef.current) {
        setDriver(driverData);
      }
    } catch (err) {
      console.error('Error fetching driver profile or timeout:', err);
      // On error or timeout, set driver to null but don't block the app
      if (mountedRef.current) {
        setDriver(null);
      }
    } finally {
      // ALWAYS set loading to false and reset fetching flag
      fetchingRef.current = false;
      if (mountedRef.current) {
        console.log('Setting loading to false - profile fetch complete');
        setLoading(false);
      }
    }
  };

  const handleUpdateDriverProfile = async (updates: Partial<Omit<Driver, 'phone' | 'user_id'>>) => {
    if (!driver) return null;

    try {
      const updatedDriver = await updateDriverProfile(driver.phone, updates);
      if (updatedDriver && mountedRef.current) {
        setDriver(updatedDriver);
      }
      return updatedDriver;
    } catch (error) {
      console.error('Error updating driver profile:', error);
      return null;
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
    // Loading will be set to false by the auth state change listener
  };

  const refreshDriverProfile = () => {
    if (user && !fetchingRef.current) {
      return handleFetchDriverProfile(user.id);
    }
  };

  return {
    user,
    driver,
    loading,
    updateDriverProfile: handleUpdateDriverProfile,
    fetchDriverProfile: refreshDriverProfile,
    signOut
  };
};
