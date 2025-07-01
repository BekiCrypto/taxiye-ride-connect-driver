
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDriverAuth } from "@/hooks/useDriverAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Index from "./pages/Index";
import Login from "./components/Login";
import KYCUpload from "./components/KYCUpload";
import SplashScreen from "./components/SplashScreen";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, driver, loading } = useDriverAuth();
  const { isAdmin, loading: adminLoading, login: adminLogin, logout: adminLogout } = useAdminAuth();
  const [showSplash, setShowSplash] = useState(true);

  console.log('App render state:', { 
    user: !!user, 
    driver: !!driver, 
    loading, 
    adminLoading,
    isAdmin,
    driverStatus: driver?.approved_status 
  });

  // Show splash screen only initially
  if (showSplash && (loading || adminLoading)) {
    console.log('Showing splash screen - loading states:', { loading, adminLoading });
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // If splash is done but still loading, show simple loading
  if ((loading || adminLoading) && !showSplash) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={
          isAdmin ? <AdminDashboard onLogout={adminLogout} /> : <AdminLogin onLogin={adminLogin} />
        } />
        <Route path="*" element={
          <>
            {/* Check for admin access first */}
            {window.location.search.includes('admin=true') ? (
              isAdmin ? <AdminDashboard onLogout={adminLogout} /> : <AdminLogin onLogin={adminLogin} />
            ) : isAdmin ? (
              <AdminDashboard onLogout={adminLogout} />
            ) : !user ? (
              <Login onLogin={() => window.location.reload()} />
            ) : driver ? (
              driver.approved_status === 'approved' ? (
                <Index />
              ) : (
                <KYCUpload onApproval={() => window.location.reload()} />
              )
            ) : (
              <KYCUpload onApproval={() => window.location.reload()} />
            )}
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
