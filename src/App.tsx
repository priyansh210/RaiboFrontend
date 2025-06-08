import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from '@/components/ui/toaster';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Index from './pages/Index';
import Browse from './pages/Browse';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import ForYou from './pages/ForYou';
import NotFound from './pages/NotFound';
import StripeCheckout from './pages/StripeCheckout';

// Auth Pages
import Login from './pages/Login';
import BuyerLogin from './pages/BuyerLogin';
import BuyerRegister from './pages/BuyerRegister';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import AccountLogin from './pages/AccountLogin';
import AuthCallback from './pages/AuthCallback';

// Seller Pages
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import SellerProductForm from './pages/SellerProductForm';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

const queryClient = new QueryClient();

function App() {
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
    <QueryClientProvider client={queryClient}>
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

                  {/* User Account */}
                  <Route path="/account" element={<Account />} />

                  {/* Seller Routes */}
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/products" element={<SellerProducts />} />
                  <Route path="/seller/products/add" element={<SellerProductForm />} />
                  <Route path="/seller/products/edit/:productId" element={<SellerProductForm />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
