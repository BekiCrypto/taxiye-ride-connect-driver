
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  previewMode: 'mobile' | 'desktop';
  setPreviewMode: (mode: 'mobile' | 'desktop') => void;
  onLogout: () => void;
}

const AdminHeader = ({ previewMode, setPreviewMode, onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Electronic Taxi Dispatch System (ETDS)</h1>
          <p className="text-sm text-gray-400">Directive Compliant - Admin Dashboard</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="flex items-center space-x-1"
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </Button>
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="flex items-center space-x-1"
            >
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
