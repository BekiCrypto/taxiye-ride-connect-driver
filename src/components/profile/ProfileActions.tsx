
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, FileText, LogOut } from 'lucide-react';

interface ProfileActionsProps {
  onLogout: () => Promise<void>;
}

const ProfileActions = ({ onLogout }: ProfileActionsProps) => {
  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full h-12 border-gray-600 text-white hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-300"
      >
        <Edit className="h-5 w-5" />
        <span>Edit Profile</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full h-12 border-gray-600 text-white hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-300"
      >
        <FileText className="h-5 w-5" />
        <span>Update Documents</span>
      </Button>
      
      <Button 
        variant="destructive" 
        className="w-full h-12 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm flex items-center justify-center space-x-2 transition-all duration-300" 
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </div>
  );
};

export default ProfileActions;
