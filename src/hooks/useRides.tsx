
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';

interface Ride {
  id: string;
  driver_id: string;
  passenger_name?: string;
  passenger_phone?: string;
  pickup_location: string;
  dropoff_location: string;
  distance_km?: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare?: number;
  commission?: number;
  net_earnings?: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export const useRides = () => {
  const { driver } = useDriverAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      fetchRides();
    }
  }, [driver]);

  const fetchRides = async () => {
    if (!driver) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', driver.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rides:', error);
    } else {
      setRides(data || []);
      const activeRide = data?.find(ride => 
        ride.status === 'accepted' || ride.status === 'in_progress'
      );
      setCurrentRide(activeRide || null);
    }
    setLoading(false);
  };

  const updateRideStatus = async (rideId: string, status: Ride['status']) => {
    const updates: any = { status };
    
    if (status === 'in_progress') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', rideId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ride status:', error);
      return null;
    }

    await fetchRides();
    return data;
  };

  const acceptRide = async (rideId: string) => {
    return await updateRideStatus(rideId, 'accepted');
  };

  const startRide = async (rideId: string) => {
    return await updateRideStatus(rideId, 'in_progress');
  };

  const completeRide = async (rideId: string, fare: number, commission: number) => {
    const net_earnings = fare - commission;
    
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        fare,
        commission,
        net_earnings
      })
      .eq('id', rideId)
      .select()
      .single();

    if (error) {
      console.error('Error completing ride:', error);
      return null;
    }

    await fetchRides();
    return data;
  };

  return {
    rides,
    currentRide,
    loading,
    fetchRides,
    acceptRide,
    startRide,
    completeRide,
    updateRideStatus
  };
};
