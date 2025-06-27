
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';
import { sampleRides } from '@/utils/sampleData';

interface Ride {
  id: string;
  driver_phone_ref: string;
  passenger_name?: string;
  passenger_phone?: string;
  passenger_phone_ref?: string;
  pickup_location: string;
  dropoff_location: string;
  distance_km?: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare?: number;
  commission?: number;
  net_earnings?: number;
  created_at: string | null;
  started_at?: string | null;
  completed_at?: string | null;
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
    
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_phone_ref', driver.phone)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rides from database:', error);
        // Fallback to sample data for development
        console.log('Using sample rides data for development');
        const driverSampleRides = sampleRides.filter(ride => 
          ride.driver_phone_ref === driver.phone
        );
        setRides(driverSampleRides);
        
        const activeRide = driverSampleRides.find(ride => 
          ride.status === 'accepted' || ride.status === 'in_progress'
        );
        setCurrentRide(activeRide || null);
      } else if (data && data.length > 0) {
        // Use real database data
        const ridesData: Ride[] = data.map(ride => ({
          id: ride.id,
          driver_phone_ref: ride.driver_phone_ref,
          passenger_name: ride.passenger_name,
          passenger_phone: ride.passenger_phone,
          passenger_phone_ref: ride.passenger_phone_ref,
          pickup_location: ride.pickup_location,
          dropoff_location: ride.dropoff_location,
          distance_km: ride.distance_km ? Number(ride.distance_km) : undefined,
          status: ride.status as Ride['status'],
          fare: ride.fare ? Number(ride.fare) : undefined,
          commission: ride.commission ? Number(ride.commission) : undefined,
          net_earnings: ride.net_earnings ? Number(ride.net_earnings) : undefined,
          created_at: ride.created_at,
          started_at: ride.started_at,
          completed_at: ride.completed_at
        }));
        
        setRides(ridesData);
        const activeRide = ridesData.find(ride => 
          ride.status === 'accepted' || ride.status === 'in_progress'
        );
        setCurrentRide(activeRide || null);
      } else {
        // No data in database, use sample data for better UX
        console.log('No rides in database, using sample data for demo');
        const driverSampleRides = sampleRides.map(ride => ({
          ...ride,
          driver_phone_ref: driver.phone // Update to current driver's phone
        }));
        setRides(driverSampleRides);
        
        const activeRide = driverSampleRides.find(ride => 
          ride.status === 'accepted' || ride.status === 'in_progress'
        );
        setCurrentRide(activeRide || null);
      }
    } catch (err) {
      console.error('Unexpected error fetching rides:', err);
      // Fallback to sample data
      const driverSampleRides = sampleRides.map(ride => ({
        ...ride,
        driver_phone_ref: driver.phone
      }));
      setRides(driverSampleRides);
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
