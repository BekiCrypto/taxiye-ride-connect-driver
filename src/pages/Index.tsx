
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import Dashboard from '../components/Dashboard';
import Wallet from '../components/Wallet';
import Profile from '../components/Profile';
import Support from '../components/Support';
import Login from '../components/Login';
import KYCUpload from '../components/KYCUpload';
import RideRequest from '../components/RideRequest';
import ActiveTrip from '../components/ActiveTrip';
import TripSummary from '../components/TripSummary';
import SOSEmergency from '../components/SOSEmergency';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [driverApproved, setDriverApproved] = useState(true); // Simulate approved driver
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    name: 'Ahmed Hassan',
    phone: '+251911123456',
    vehicleModel: 'Toyota Corolla',
    plateNumber: 'AA-123-456',
    walletBalance: 2500.50
  });

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!driverApproved) {
    return <KYCUpload onApproval={() => setDriverApproved(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Dashboard user={currentUser} />} />
        <Route path="/wallet" element={<Wallet user={currentUser} />} />
        <Route path="/profile" element={<Profile user={currentUser} />} />
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
