
import React from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
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

  if (!driver) return null;

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
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
