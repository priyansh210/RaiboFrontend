import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AccountLogin from "./pages/AccountLogin";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerRegister from "./pages/BuyerRegister";
import SellerRegister from "./pages/SellerRegister";
import ForYou from "./pages/ForYou";
import NotFound from "./pages/NotFound";
import SellerDashboard from "./pages/SellerDashboard";
import AuthCallback from "./pages/AuthCallback";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/browse/:category" element={<Browse />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<Checkout />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/account" element={<Account />} />
              <Route path="/search" element={<Search />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Buyer Authentication Routes - keep for backward compatibility */}
              <Route path="/buyer/login" element={<BuyerLogin />} />
              <Route path="/buyer/register" element={<BuyerRegister />} />
              
              {/* Seller Authentication Routes */}
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/register" element={<SellerRegister />} />
              
              {/* Seller Dashboard Routes */}
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/dashboard/products" element={<SellerDashboard />} />
              <Route path="/seller/dashboard/orders" element={<SellerDashboard />} />
              <Route path="/seller/dashboard/reviews" element={<SellerDashboard />} />
              <Route path="/seller/dashboard/analytics" element={<SellerDashboard />} />
              
              <Route path="/for-you" element={<ForYou />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
