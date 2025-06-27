
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Code, Eye } from 'lucide-react';

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  component?: React.ComponentType;
  codeSnippet?: string;
  features?: string[];
}

interface ComponentPreviewProps {
  components: ComponentItem[];
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
  const component = components.find(c => c.id === selectedComponent);

  if (!component) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Select a component to preview</div>
          <div className="text-gray-500 text-sm">Choose from the sidebar to see component details</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600/20 text-green-400';
      case 'in-progress': return 'bg-yellow-600/20 text-yellow-400';
      case 'pending': return 'bg-gray-600/20 text-gray-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="flex-1 bg-gray-900 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{component.name}</h1>
                <Badge className={getStatusColor(component.status)}>
                  {component.status}
                </Badge>
              </div>
              <p className="text-gray-400">{component.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <Code className="h-4 w-4 mr-1" />
                View Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open Full
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Live Preview</span>
                  <Badge variant="secondary">{previewMode}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`
                  bg-gray-900 rounded-lg p-4 
                  ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}
                `}>
                  <div className="text-white text-center py-8">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold">TX</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{component.name}</h3>
                    <p className="text-gray-400 text-sm">Component preview placeholder</p>
                    <div className="mt-4 text-xs text-gray-500">
                      This would show the actual {component.name} component
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Component Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Category</h4>
                  <Badge variant="secondary">{component.category}</Badge>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Status</h4>
                  <Badge className={getStatusColor(component.status)}>
                    {component.status}
                  </Badge>
                </div>

                {component.features && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Features</h4>
                    <ul className="space-y-1">
                      {component.features.map((feature, index) => (
                        <li key={index} className="text-gray-300 text-sm flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {component.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPreview;
