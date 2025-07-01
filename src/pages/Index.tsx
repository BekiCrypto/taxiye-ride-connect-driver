
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const Index = () => {
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
