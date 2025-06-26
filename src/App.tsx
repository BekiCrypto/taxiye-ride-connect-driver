
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

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, driver, loading } = useDriverAuth();
  const { isAdmin, loading: adminLoading, login: adminLogin, logout: adminLogout } = useAdminAuth();

  console.log('App render state:', { 
    user: !!user, 
    driver: !!driver, 
    loading, 
    adminLoading,
    isAdmin,
    driverStatus: driver?.approved_status 
  });

  // Show loading screen while checking authentication
  if (loading || adminLoading) {
    console.log('Showing splash screen - loading states:', { loading, adminLoading });
    return <SplashScreen />;
  }

  // Check for admin access first
  if (isAdmin) {
    console.log('Admin logged in, showing dashboard');
    return <AdminDashboard onLogout={adminLogout} />;
  }

  // Check URL for admin access
  if (window.location.pathname === '/admin' || window.location.search.includes('admin=true')) {
    console.log('Admin login page requested');
    return <AdminLogin onLogin={adminLogin} />;
  }

  // If user is authenticated and driver is approved, show main app
  if (user && driver && driver.approved_status === 'approved') {
    console.log('Driver is approved, showing main dashboard');
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If user is authenticated but no driver profile exists, show KYC to create one
  if (user && !driver) {
    console.log('User authenticated but no driver profile found, showing KYC');
    return (
      <KYCUpload 
        onApproval={() => {
          console.log('KYC approval completed, refreshing driver profile');
          window.location.reload();
        }} 
      />
    );
  }

  // If user has driver profile but not approved, show KYC
  if (user && driver && driver.approved_status !== 'approved') {
    console.log('Driver profile exists but not approved, showing KYC:', {
      status: driver.approved_status
    });
    return (
      <KYCUpload 
        onApproval={() => {
          console.log('KYC approval completed, refreshing driver profile');
          window.location.reload();
        }} 
      />
    );
  }

  // Default to login page for fresh start
  console.log('No authenticated user or driver profile, showing login');
  return <Login />;
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
