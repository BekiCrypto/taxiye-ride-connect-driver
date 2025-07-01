
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusHeader from './dashboard/StatusHeader';
import StatusAlert from './dashboard/StatusAlert';
import StatsCards from './dashboard/StatsCards';
import WalletCard from './dashboard/WalletCard';
import QuickActions from './dashboard/QuickActions';
import VehicleInfo from './dashboard/VehicleInfo';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { driver, user } = useDriverAuth();
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    try {
      if (onNavigate) onNavigate(page);
      navigate(`/${page}`);
    } catch (error) {
      console.error('Dashboard navigation error:', error);
    }
  };

  // Show a welcome message if no driver profile exists but user is logged in
  if (!driver && user) {
    return (
      <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome! 👋
            </h1>
            <p className="text-gray-400">Complete your profile to get started</p>
          </div>
          <Button
            onClick={() => handleNavigation('notifications')}
            size="sm"
            variant="outline"
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Bell className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Get Started</h2>
          <p className="text-gray-400 mb-4">
            Complete your driver profile to access all features
          </p>
          <Button
            onClick={() => handleNavigation('kyc')}
            className="bg-green-600 hover:bg-green-700"
          >
            Complete Profile
          </Button>
        </div>

        <QuickActions onNavigate={handleNavigation} />
      </div>
    );
  }

  if (!driver && !user) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      {/* Header with greeting and notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hello, {driver?.name || 'Driver'}! 👋
          </h1>
          <p className="text-gray-400">Ready to earn today?</p>
        </div>
        <Button
          onClick={() => handleNavigation('notifications')}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      <StatusHeader />
      <StatusAlert onNavigate={handleNavigation} />
      <StatsCards />
      <WalletCard onNavigate={handleNavigation} />
      <QuickActions onNavigate={handleNavigation} />
      <VehicleInfo />
    </div>
  );
};

export default Dashboard;
