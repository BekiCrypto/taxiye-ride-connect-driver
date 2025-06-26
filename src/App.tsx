
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

  // Check if we're on the reset password route - this should be accessible without authentication
  const isResetPasswordRoute = window.location.pathname === '/reset-password';

  // Show loading screen while checking authentication (except for reset password route)
  if ((loading || adminLoading) && !isResetPasswordRoute) {
    console.log('Showing splash screen - loading states:', { loading, adminLoading });
    return <SplashScreen />;
  }

  // Always render the full router structure to handle all routes properly
  return (
    <BrowserRouter>
      <Routes>
        {/* Reset password route - accessible without authentication */}
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          isAdmin ? <AdminDashboard onLogout={adminLogout} /> : <AdminLogin onLogin={adminLogin} />
        } />
        
        {/* Main app routes */}
        <Route path="/*" element={
          (() => {
            // Check for admin access first (if URL indicates admin)
            if (window.location.search.includes('admin=true')) {
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

            // If no user, show login/signup
            if (!user) {
              console.log('No authenticated user, showing login');
              return <Login />;
            }

            // User is authenticated, check if they have driver profile and approval status
            if (user && driver && driver.approved_status === 'approved') {
              // User is approved → Go to Home
              console.log('Driver is approved, showing main dashboard');
              return <Index />;
            }

            // User is authenticated but either no driver profile OR not approved → Go to KYC
            console.log('User authenticated but needs KYC:', {
              hasDriver: !!driver,
              status: driver?.approved_status || 'no profile'
            });
            return (
              <KYCUpload 
                onApproval={() => {
                  console.log('KYC approval completed, refreshing driver profile');
                  window.location.reload();
                }} 
              />
            );
          })()
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
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
