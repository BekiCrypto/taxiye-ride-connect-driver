
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

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Dashboard onNavigate={(page) => window.location.hash = `#${page}`} />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/ride-request" element={<RideRequest />} />
        <Route path="/active-trip" element={<ActiveTrip />} />
        <Route path="/trip-summary" element={<TripSummary />} />
        <Route path="/sos" element={<SOSEmergency />} />
      </Routes>
      <BottomNavigation />
    </div>
  );
};

export default Index;
