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
import Index from './pages/Index';
import Browse from './pages/Browse';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import MyOrders from './pages/MyOrders';
import ForYou from './pages/ForYou';
import ForYouFeed from './pages/ForYouFeed';
import MyRooms from './pages/MyRooms';
import RoomDetail from './pages/RoomDetail';
import NotFound from './pages/NotFound';
import RaiBoards from './pages/RaiBoards';
import RaiBoardDetail from './pages/RaiBoardDetail';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutFailure from './pages/CheckoutFailure';
import OrderDetail from './pages/OrderDetail';

// Auth Pages
import Login from './pages/Login';
import BuyerLogin from './pages/BuyerLogin';
import BuyerRegister from './pages/BuyerRegister';
import AccountLogin from './pages/AccountLogin';
import AuthCallback from './pages/AuthCallback';

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
                <Route path="/for-you" element={<ForYou />} />
                <Route path="/for-you/feed/:startIndex" element={<ForYouFeed />} />
                <Route path="/my-rooms" element={<MyRooms />} />
                <Route path="/room/:id" element={<RoomDetail />} />

                {/* RaiBoards Routes */}
                <Route path="/raiboards" element={<RaiBoards />} />
                <Route path="/raiboards/:boardId" element={<RaiBoardDetail />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/buyer/login" element={<BuyerLogin />} />
                <Route path="/buyer/register" element={<BuyerRegister />} />
                <Route path="/account/login" element={<AccountLogin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* User Account */}
                <Route path="/account" element={<Account />} />
                <Route path="/my-orders" element={<MyOrders />} />

                {/* Checkout Success/Failure Routes */}
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/failure" element={<CheckoutFailure />} />
                <Route path="/order/:orderId" element={<OrderDetail />} />

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
