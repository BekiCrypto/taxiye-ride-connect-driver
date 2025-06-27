
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Component {
  id: string;
  name: string;
  component: React.ComponentType<any>;
}

interface ComponentPreviewProps {
  components: Component[];
  selectedComponent: string;
  previewMode: 'mobile' | 'desktop';
  setSelectedComponent: (id: string) => void;
}

const ComponentPreview = ({ 
  components, 
  selectedComponent, 
  previewMode, 
  setSelectedComponent 
}: ComponentPreviewProps) => {
  const renderComponent = () => {
    const selected = components.find(c => c.id === selectedComponent);
    if (!selected) return null;

    const Component = selected.component;
    
    // Handle components that need specific props
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

    if (selectedComponent === 'kyc-upload') {
      return <Component 
        onApproval={() => {
          console.log('KYC approval completed in preview');
          setSelectedComponent('dashboard');
        }} 
      />;
    }
    
    // For components that need onNavigate prop
    if (['profile', 'wallet', 'support', 'ride-request', 'active-trip', 'trip-summary', 'sos'].includes(selectedComponent)) {
      return <Component onNavigate={(page: string) => {
        console.log('Navigation attempt to:', page);
        const targetComponent = components.find(c => c.name.toLowerCase().includes(page.toLowerCase()));
        if (targetComponent) {
          setSelectedComponent(targetComponent.id);
        }
      }} />;
    }

    // For login component, no props needed
    return <Component />;
  };

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">
              {selectedComponentData?.name || 'Component'}
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
  );
};

export default ComponentPreview;
