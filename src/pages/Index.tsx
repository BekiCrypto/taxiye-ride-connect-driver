
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { supabase } from '@/integrations/supabase/client';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import Wallet from '../components/Wallet';
import Profile from '../components/Profile';
import Support from '../components/Support';
import KYCUpload from '../components/KYCUpload';
import RideRequest from '../components/RideRequest';
import ActiveTrip from '../components/ActiveTrip';
import TripSummary from '../components/TripSummary';
import SOSEmergency from '../components/SOSEmergency';
import Notifications from '../components/Notifications';
import Referral from '../components/Referral';
import EarningsHistory from '../components/EarningsHistory';
import PassengerDashboard from '../components/passenger/PassengerDashboard';
import PassengerRegistration from '../components/passenger/PassengerRegistration';
import RideBooking from '../components/passenger/RideBooking';
import UserTypeSelector from '../components/UserTypeSelector';

const Index = () => {
  const { user, driver } = useDriverAuth();
  const [userType, setUserType] = useState<'driver' | 'passenger' | null>(null);
  const [passengerProfile, setPassengerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineUserType = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has passenger profile
        const { data: passenger } = await supabase
          .from('passengers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (passenger) {
          setUserType('passenger');
          setPassengerProfile(passenger);
        } else if (driver) {
          setUserType('driver');
        } else {
          // User exists but no specific profile - let them choose
          setUserType(null);
        }
      } catch (error) {
        console.log('No passenger profile found');
        if (driver) {
          setUserType('driver');
        }
      } finally {
        setLoading(false);
      }
    };

    determineUserType();
  }, [user, driver]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  // If no user type is determined, show selector
  if (!userType) {
    return (
      <UserTypeSelector 
        onSelectType={(type) => {
          if (type === 'passenger') {
            setUserType('passenger');
          } else if (type === 'driver') {
            setUserType('driver');
          }
        }} 
      />
    );
  }

  // Passenger interface
  if (userType === 'passenger') {
    if (!passengerProfile) {
      return <PassengerRegistration onComplete={() => window.location.reload()} />;
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white pb-20">
        <Routes>
          <Route path="/" element={<PassengerDashboard />} />
          <Route path="/book-ride" element={<RideBooking />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
        <BottomNavigation />
      </div>
    );
  }

  // Driver interface (existing functionality)
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={(page) => console.log('Navigate to:', page)} />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/earnings" element={<EarningsHistory />} />
        <Route path="/ride-request" element={<RideRequest />} />
        <Route path="/active-trip" element={<ActiveTrip />} />
        <Route path="/trip-summary" element={<TripSummary />} />
        <Route path="/sos" element={<SOSEmergency />} />
        <Route path="/kyc" element={<KYCUpload onApproval={() => window.location.reload()} />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
};

export default Index;
