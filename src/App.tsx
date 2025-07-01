
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

  // Show loading screen while checking authentication or splash screen
  if ((loading || adminLoading) && showSplash) {
    console.log('Showing splash screen - loading states:', { loading, adminLoading });
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Check for admin access first (if URL indicates admin)
  if (window.location.pathname === '/admin' || window.location.search.includes('admin=true')) {
    if (isAdmin) {
      console.log('Admin logged in, showing dashboard');
      return <AdminDashboard onLogout={adminLogout} />;
    }
    console.log('Admin login page requested');
    return <AdminLogin onLogin={adminLogin} />;
  }

  // If admin is logged in but not on admin route, show admin dashboard
  if (isAdmin) {
    console.log('Admin logged in, showing dashboard');
    return <AdminDashboard onLogout={adminLogout} />;
  }

  // Step 1: If no user is authenticated, show login/signup
  if (!user) {
    console.log('No authenticated user, showing login');
    return <Login onLogin={() => window.location.reload()} />;
  }

  // Step 2: User is authenticated - check driver profile and approval status
  if (driver) {
    if (driver.approved_status === 'approved') {
      // User is approved → Go to Home Dashboard
      console.log('Driver is approved, showing main dashboard');
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Index />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      );
    } else {
      // Driver exists but not approved (pending/rejected) → Go to KYC
      console.log('Driver exists but not approved, showing KYC:', driver.approved_status);
      return (
        <KYCUpload 
          onApproval={() => {
            console.log('KYC approval completed, refreshing driver profile');
            window.location.reload();
          }} 
        />
      );
    }
  } else {
    // Step 3: User is authenticated but no driver profile exists → Go to Document Verification (KYC)
    console.log('User authenticated but no driver profile, showing KYC for document verification');
    return (
      <KYCUpload 
        onApproval={() => {
          console.log('KYC approval completed, refreshing driver profile');
          window.location.reload();
        }} 
      />
    );
  }
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
