
import React from 'react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import ProfileHeader from './profile/ProfileHeader';
import StatsGrid from './profile/StatsGrid';
import PersonalInfoCard from './profile/PersonalInfoCard';
import VehicleInfoCard from './profile/VehicleInfoCard';
import DocumentsCard from './profile/DocumentsCard';
import ProfileActions from './profile/ProfileActions';

const Profile = () => {
  const { driver, signOut, loading } = useDriverAuth();

  if (loading) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="text-white text-lg mb-2">Driver profile not found</div>
          <div className="text-gray-400">Please contact support for assistance</div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      <ProfileHeader driver={driver} />
      <StatsGrid />
      <PersonalInfoCard driver={driver} />
      <VehicleInfoCard driver={driver} />
      <DocumentsCard driver={driver} />
      <ProfileActions onLogout={handleLogout} />
    </div>
  );
};

export default Profile;
