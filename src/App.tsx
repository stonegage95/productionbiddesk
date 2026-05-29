import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Security from "./pages/Security.tsx";
import FAQ from "./pages/FAQ.tsx";
import Demo from "./pages/Demo.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Auth from "./pages/Auth.tsx";
import BidDeskApp from "./pages/BidDeskApp.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Pricing from "./pages/Pricing.tsx";
import NotFound from "./pages/NotFound.tsx";
import ClapperboardWidget from "./components/ClapperboardWidget.tsx";
import AdminMessages from "./pages/AdminMessages.tsx";
import AdminTrialUsers from "./pages/AdminTrialUsers.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/solutions" element={<Navigate to="/#solutions" replace />} />
          <Route path="/security" element={<Security />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/auth" element={<Navigate to="/app" replace />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/app" element={<ProtectedRoute><BidDeskApp /></ProtectedRoute>} />
          <Route path="/bid-desk-app" element={<Navigate to="/app" replace />} />
          <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
          <Route path="/admin/trial-users" element={<ProtectedRoute><AdminTrialUsers /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ClapperboardWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
