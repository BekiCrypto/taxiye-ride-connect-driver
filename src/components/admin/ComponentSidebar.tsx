
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ComponentSidebarProps {
  components: Component[];
  selectedComponent: string;
  setSelectedComponent: (id: string) => void;
  previewMode: 'mobile' | 'desktop';
}

const ComponentSidebar = ({ 
  components, 
  selectedComponent, 
  setSelectedComponent, 
  previewMode 
}: ComponentSidebarProps) => {
  return (
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
  );
};

export default ComponentSidebar;
