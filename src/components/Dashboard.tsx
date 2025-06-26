
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
  onNavigate: (page: string) => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { driver } = useDriverAuth();
  const navigate = useNavigate();

  if (!driver) return null;

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      {/* Header with greeting and notifications */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Hello, {driver.name}! 👋
          </h1>
          <p className="text-gray-400">Ready to earn today?</p>
        </div>
        <Button
          onClick={() => navigate('/notifications')}
          size="sm"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-700"
        >
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      <StatusHeader />
      <StatusAlert onNavigate={onNavigate} />
      <StatsCards />
      <WalletCard onNavigate={onNavigate} />
      <QuickActions onNavigate={onNavigate} />
      <VehicleInfo />
    </div>
  );
};

export default Dashboard;
