
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Index from './pages/buyer/Index';
import Browse from './pages/buyer/Browse';
import ProductDetail from './pages/buyer/ProductDetail';
import Search from './pages/buyer/Search';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import Account from './pages/buyer/Account';
import ForYou from './pages/buyer/ForYou';
import MyRooms from './pages/buyer/MyRooms';
import RoomDetail from './pages/buyer/RoomDetail';
import NotFound from './pages/buyer/NotFound';
import StripeCheckout from './pages/buyer/StripeCheckout';

// Auth Pages
import Login from './pages/buyer/Login';
import BuyerLogin from './pages/buyer/BuyerLogin';
import BuyerRegister from './pages/buyer/BuyerRegister';
import SellerLogin from './pages/seller/SellerLogin';
import SellerRegister from './pages/seller/SellerRegister';
import AccountLogin from './pages/AccountLogin';
import AuthCallback from './pages/AuthCallback';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerProductPreview from './pages/seller/SellerProductPreview';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductPreview from './pages/admin/AdminProductPreview';

import './App.css';

const queryClient = new QueryClient();

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <div className="min-h-screen flex flex-col">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/browse/:category?" element={<Browse />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/stripe-checkout" element={<StripeCheckout />} />
                <Route path="/for-you" element={<ForYou />} />
                <Route path="/my-rooms" element={<MyRooms />} />
                <Route path="/room/:id" element={<RoomDetail />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/buyer/login" element={<BuyerLogin />} />
                <Route path="/buyer/register" element={<BuyerRegister />} />
                <Route path="/seller/login" element={<SellerLogin />} />
                <Route path="/seller/register" element={<SellerRegister />} />
                <Route path="/account/login" element={<AccountLogin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products/preview/:productId" element={<AdminProductPreview />} />

                {/* User Account */}
                <Route path="/account" element={<Account />} />

                {/* Seller Routes */}
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/products" element={<SellerProducts />} />
                <Route path="/seller/products/add" element={<SellerProductForm />} />
                <Route path="/seller/products/edit/:productId" element={<SellerProductForm />} />
                <Route path="/seller/products/preview/:productId" element={<SellerProductPreview />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
