import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button"

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';

  const handleSubmit = async () => {
    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Simulate a successful checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Order confirmed!",
        description: "Thank you! Your order has been successfully placed.",
      });
      clearCart();
      navigate('/');
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrorMessage('Failed to process your order. Please try again.');
      toast({
        title: "Checkout failed",
        description: errorMessage || 'Failed to process your order. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom max-w-3xl">
          <div className="bg-white p-8 rounded-sm shadow-sm animate-fade-in">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Checkout</h1>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-sm">
                {errorMessage}
              </div>
            )}

            <div className="mb-6">
              <h2 className="font-medium text-charcoal mb-2">Contact Information</h2>
              <p className="text-sm text-earth">
                {fullName} ({user?.email})
              </p>
            </div>

            <div className="mb-6">
              <h2 className="font-medium text-charcoal mb-2">Order Summary</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-taupe/20">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-sm mr-4" />
                    <div>
                      <p className="text-sm text-earth">{item.name}</p>
                      <p className="text-xs text-taupe">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-sm text-earth">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div className="font-medium text-charcoal text-right mt-2">
                Total: ${total.toFixed(2)}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-medium text-charcoal mb-2">Shipping Address</h2>
              <p className="text-sm text-earth">
                123 Main Street, Anytown, USA
              </p>
            </div>

            <div className="mb-6">
              <h2 className="font-medium text-charcoal mb-2">Payment Method</h2>
              <p className="text-sm text-earth">
                Credit Card ending in 4242
              </p>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full bg-terracotta hover:bg-umber text-white py-3 transition-colors disabled:bg-taupe"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
