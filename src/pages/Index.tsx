
import { useState } from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import Dashboard from '@/components/Dashboard';
import Profile from '@/components/Profile';
import Wallet from '@/components/Wallet';
import ActiveTrip from '@/components/ActiveTrip';
import RideRequest from '@/components/RideRequest';
import SOSEmergency from '@/components/SOSEmergency';
import Support from '@/components/Support';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { driver } = useDriverAuth();

  console.log('Index page render:', { currentPage, driver: !!driver });

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile />;
      case 'wallet':
        return <Wallet />;
      case 'active-trip':
        return <ActiveTrip />;
      case 'ride-request':
        return <RideRequest />;
      case 'sos':
        return <SOSEmergency />;
      case 'support':
        return <Support />;
      case 'notifications':
        return (
          <div className="p-4 pb-20 bg-gray-900 min-h-screen">
            <div className="text-white text-center mt-20">
              <h1 className="text-2xl font-bold mb-4">Notifications</h1>
              <p className="text-gray-400">No new notifications</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderCurrentPage()}
      <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;
