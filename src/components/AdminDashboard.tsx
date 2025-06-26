
import React, { useState } from 'react';
import AdminHeader from './admin/AdminHeader';
import ComponentSidebar from './admin/ComponentSidebar';
import ComponentPreview from './admin/ComponentPreview';
import { adminComponents } from './admin/AdminComponentList';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [selectedComponent, setSelectedComponent] = useState('dashboard');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader 
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onLogout={onLogout}
      />

      <div className="flex max-w-7xl mx-auto">
        <ComponentSidebar 
          components={adminComponents}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          previewMode={previewMode}
        />

        <ComponentPreview 
          components={adminComponents}
          selectedComponent={selectedComponent}
          previewMode={previewMode}
          setSelectedComponent={setSelectedComponent}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
