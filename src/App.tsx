
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./components/auth/AuthProvider";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WaitingApproval from "./pages/WaitingApproval";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProductUpload from "./pages/ProductUpload";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ProductEdit from "./pages/ProductEdit";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <AuthProvider requireAuth={false}>
              <Login />
            </AuthProvider>
          } />
          <Route path="/signup" element={
            <AuthProvider requireAuth={false}>
              <Signup />
            </AuthProvider>
          } />
          <Route path="/waiting-approval" element={
            <AuthProvider requireAuth={false}>
              <WaitingApproval />
            </AuthProvider>
          } />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <AuthProvider requireAuth={true}>
              <DashboardLayout />
            </AuthProvider>
          }>
            <Route index element={<Dashboard />} />
            <Route path="product-upload" element={<ProductUpload />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="products/edit/:id" element={<ProductEdit />} />
            {/* Add more dashboard routes here */}
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Redirect index to dashboard or login */}
          <Route path="/" element={
            <AuthProvider requireAuth={false}>
              <Index />
            </AuthProvider>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
