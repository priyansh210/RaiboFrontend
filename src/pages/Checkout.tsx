
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button"
import { supabase } from '../integrations/supabase/client';

const Checkout = () => {
  const { cart, cartItems, total, clearCart } = useCart();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Shipping information
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/buyer/login', { state: { from: '/checkout' } });
    }
    
    // Pre-fill with user profile data if available
    if (profile) {
      setShippingAddress(profile.address || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setZipCode(profile.zip || '');
      setCountry(profile.country || 'USA');
    }
  }, [isAuthenticated, navigate, profile]);

  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
      });
      return;
    }

    // Validate shipping address
    if (!shippingAddress || !city || !state || !zipCode) {
      toast({
        title: "Missing shipping information",
        description: "Please fill in all shipping fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const formattedAddress = `${shippingAddress}, ${city}, ${state} ${zipCode}, ${country}`;

    try {
      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user?.id,
          total_amount: total,
          shipping_address: formattedAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor?.name || null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

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
              <h2 className="font-medium text-charcoal mb-2">Shipping Address</h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="address" className="block text-sm text-earth mb-1">Street Address</label>
                  <input
                    id="address"
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    className="w-full p-2 border border-taupe/30 rounded-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="city" className="block text-sm text-earth mb-1">City</label>
                    <input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full p-2 border border-taupe/30 rounded-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm text-earth mb-1">State</label>
                    <input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full p-2 border border-taupe/30 rounded-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm text-earth mb-1">ZIP Code</label>
                    <input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                      className="w-full p-2 border border-taupe/30 rounded-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm text-earth mb-1">Country</label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-2 border border-taupe/30 rounded-sm"
                    >
                      <option value="USA">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-medium text-charcoal mb-2">Order Summary</h2>
              {cartItems.map((item) => (
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
              <h2 className="font-medium text-charcoal mb-2">Payment Method</h2>
              <div className="p-3 bg-linen rounded-sm">
                <p className="text-sm text-earth">
                  Credit Card ending in 4242 (Demo Mode)
                </p>
              </div>
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
