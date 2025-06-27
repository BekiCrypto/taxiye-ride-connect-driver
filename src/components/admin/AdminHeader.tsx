
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  previewMode: 'mobile' | 'desktop';
  setPreviewMode: (mode: 'mobile' | 'desktop') => void;
  onLogout: () => void;
}

const AdminHeader = ({ previewMode, setPreviewMode, onLogout }: AdminHeaderProps) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Review Panel</h1>
            <p className="text-sm text-gray-400">Driver App Components</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1 rounded text-sm ${
                previewMode === 'mobile' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1 rounded text-sm ${
                previewMode === 'desktop' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Desktop
            </button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
