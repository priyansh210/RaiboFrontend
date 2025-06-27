import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { order, cart, total } = location.state || {};

  useEffect(() => {
    // If no cart or total, redirect immediately
    if (!cart || !total) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate, cart, total]);

  return (
    <Layout>
      <div className="min-h-screen py-12" style={{ backgroundColor: theme.muted }}>
        <div className="container-custom max-w-3xl">
          <div className="p-8 rounded-lg shadow-sm text-center" style={{ backgroundColor: theme.background }}>
            <div className="mx-auto w-16 h-16 mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
              <Check size={32} style={{ color: '#22c55e' }} />
            </div>
            <h1 className="font-playfair text-3xl mb-4" style={{ color: theme.foreground }}>Order Confirmed!</h1>
            <p className="mb-6" style={{ color: theme.mutedForeground }}>
              Thank you for your purchase. Your order has been placed successfully.<br />You will be redirected to the home page shortly.
            </p>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2" style={{ color: theme.foreground }}>Purchased Items</h2>
              <div className="divide-y" style={{ borderColor: theme.border }}>
                {cart && cart.length > 0 ? cart.map((item: any) => (
                  <div key={item.id} className="flex items-center py-3 gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded bg-linen" />
                    <div className="flex-1 text-left">
                      <div className="font-medium" style={{ color: theme.foreground }}>{item.name}</div>
                      <div className="text-sm" style={{ color: theme.mutedForeground }}>Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold" style={{ color: theme.foreground }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                )) : <div className="text-sm" style={{ color: theme.mutedForeground }}>No items found.</div>}
              </div>
            </div>
            <div className="text-xl font-bold mb-6" style={{ color: theme.primary }}>
              Total Paid: ${total ? total.toFixed(2) : '0.00'}
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className="px-6 py-3 rounded-lg transition-colors"
                style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
