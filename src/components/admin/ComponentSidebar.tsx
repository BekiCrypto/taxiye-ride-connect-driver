
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
}

interface ComponentSidebarProps {
  components: ComponentItem[];
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600/20 text-green-400';
      case 'in-progress': return 'bg-yellow-600/20 text-yellow-400';
      case 'pending': return 'bg-gray-600/20 text-gray-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const categories = [...new Set(components.map(c => c.category))];

  return (
    <div className={`bg-gray-800 border-r border-gray-700 ${
      previewMode === 'mobile' ? 'w-64' : 'w-80'
    }`}>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Components</h2>
        <p className="text-gray-400 text-sm">Review app components</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-4">
          {categories.map(category => (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {components
                  .filter(component => component.category === category)
                  .map(component => (
                    <Card
                      key={component.id}
                      className={`cursor-pointer transition-colors ${
                        selectedComponent === component.id
                          ? 'bg-purple-900/30 border-purple-600'
                          : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedComponent(component.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white text-sm">
                            {component.name}
                          </h4>
                          <Badge className={getStatusColor(component.status)}>
                            {component.status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {component.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComponentSidebar;
