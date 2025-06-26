
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, HelpCircle } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white flex items-center">
        <span className="mr-2">⚡</span>
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={() => onNavigate('notifications')}
          className="w-full h-14 bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-between px-6 transition-all duration-300 hover:shadow-lg"
          variant="outline"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-left">
              <div className="text-white font-medium">Notifications</div>
              <div className="text-xs text-gray-400">Check latest updates</div>
            </div>
          </div>
          <Badge className="bg-blue-600/20 text-blue-400">3</Badge>
        </Button>

        <Button
          onClick={() => onNavigate('support')}
          className="w-full h-14 bg-gray-800/60 border border-gray-700/50 hover:bg-gray-700/60 backdrop-blur-sm flex items-center justify-start space-x-3 px-6 transition-all duration-300 hover:shadow-lg"
          variant="outline"
        >
          <div className="p-2 bg-green-600/20 rounded-lg">
            <HelpCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-left">
            <div className="text-white font-medium">Help & Support</div>
            <div className="text-xs text-gray-400">Get assistance 24/7</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
