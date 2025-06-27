
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, LogOut, Settings } from 'lucide-react';

interface AdminHeaderProps {
  previewMode: 'mobile' | 'desktop';
  setPreviewMode: (mode: 'mobile' | 'desktop') => void;
  onLogout: () => void;
}

const AdminHeader = ({ previewMode, setPreviewMode, onLogout }: AdminHeaderProps) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TX</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Taxiye Admin</h1>
              <p className="text-gray-400 text-sm">Component Review Panel</p>
            </div>
          </div>
          <Badge className="bg-purple-600/20 text-purple-400">
            Admin Panel
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            <Button
              onClick={() => setPreviewMode('mobile')}
              size="sm"
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              className={previewMode === 'mobile' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:text-white'
              }
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
            <Button
              onClick={() => setPreviewMode('desktop')}
              size="sm"
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              className={previewMode === 'desktop' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:text-white'
              }
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
          </div>

          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
