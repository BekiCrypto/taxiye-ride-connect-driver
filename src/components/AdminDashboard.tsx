import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Monitor, 
  User, 
  Car, 
  DollarSign, 
  Bell, 
  HelpCircle, 
  LogOut,
  Eye,
  Settings
} from 'lucide-react';

// Import the components we want to preview
import Dashboard from './Dashboard';
import Profile from './Profile';
import Wallet from './Wallet';
import Support from './Support';
import RideRequest from './RideRequest';
import ActiveTrip from './ActiveTrip';
import TripSummary from './TripSummary';
import SOSEmergency from './SOSEmergency';
import Login from './Login';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const components = [
    { id: 'dashboard', name: 'Dashboard', icon: Monitor, component: Dashboard },
    { id: 'profile', name: 'Profile', icon: User, component: Profile },
    { id: 'wallet', name: 'Wallet', icon: DollarSign, component: Wallet },
    { id: 'support', name: 'Support', icon: HelpCircle, component: Support },
    { id: 'ride-request', name: 'Ride Request', icon: Car, component: RideRequest },
    { id: 'active-trip', name: 'Active Trip', icon: Car, component: ActiveTrip },
    { id: 'trip-summary', name: 'Trip Summary', icon: Car, component: TripSummary },
    { id: 'sos', name: 'SOS Emergency', icon: Bell, component: SOSEmergency },
    { id: 'login', name: 'Login', icon: User, component: Login }
  ];

  const renderComponent = () => {
    const selected = components.find(c => c.id === selectedComponent);
    if (!selected) return null;

    const Component = selected.component;
    
    // Handle components that need props
    if (selectedComponent === 'dashboard') {
      return <Component onNavigate={(page: string) => {
        console.log('Navigation attempt to:', page);
        // In admin preview, we can switch to the requested component
        const targetComponent = components.find(c => c.name.toLowerCase().includes(page.toLowerCase()));
        if (targetComponent) {
          setSelectedComponent(targetComponent.id);
        }
      }} />;
    }
    
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin Header */}
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

      <div className="flex max-w-7xl mx-auto">
        {/* Component Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 min-h-screen">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Components
          </h2>
          <div className="space-y-2">
            {components.map((component) => {
              const Icon = component.icon;
              return (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                    selectedComponent === component.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{component.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-sm font-semibold mb-2">Quick Info</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Total Components:</span>
                <Badge variant="outline" className="text-xs">{components.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Preview Mode:</span>
                <Badge variant="outline" className="text-xs">{previewMode}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Component Preview */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {components.find(c => c.id === selectedComponent)?.name || 'Component'}
                </h2>
                <p className="text-gray-400">Preview and test the component</p>
              </div>
              <Badge className="bg-green-600">
                {previewMode === 'mobile' ? 'Mobile View' : 'Desktop View'}
              </Badge>
            </div>
          </div>

          {/* Component Preview Container */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div 
              className={`mx-auto bg-gray-900 rounded-lg overflow-hidden ${
                previewMode === 'mobile' 
                  ? 'max-w-sm min-h-screen' 
                  : 'w-full min-h-screen'
              }`}
              style={{ 
                height: previewMode === 'mobile' ? '800px' : 'auto',
                maxHeight: '800px',
                overflowY: 'auto'
              }}
            >
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
