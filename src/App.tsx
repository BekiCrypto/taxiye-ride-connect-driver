
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDriverAuth } from "@/hooks/useDriverAuth";
import Index from "./pages/Index";
import Login from "./components/Login";
import KYCUpload from "./components/KYCUpload";
import SplashScreen from "./components/SplashScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, driver, loading } = useDriverAuth();

  console.log('App state:', { user: !!user, driver: !!driver, loading, driverStatus: driver?.approved_status });

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    console.log('No user found, showing login');
    return <Login />;
  }

  // If user is authenticated but no driver profile exists or not approved, show KYC
  if (!driver || driver.approved_status === 'pending' || driver.approved_status === 'rejected') {
    console.log('Driver not approved, showing KYC');
    return (
      <KYCUpload 
        onApproval={() => {
          // This will be handled by the database trigger and auth state change
          console.log('KYC approval completed');
        }} 
      />
    );
  }

  console.log('User and driver approved, showing main app');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
