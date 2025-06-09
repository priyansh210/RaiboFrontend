
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/ApiService';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to continue with checkout.",
        variant: "destructive",
      });
      navigate('/buyer/login', { state: { redirect: '/cart' } });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some products before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create order items from cart
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        color: item.selectedColor?.name || null
      }));
      
      const response = await apiService.getCart() as { error?: any; cart?: any };
    
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Clear the cart
      // clearCart();
      
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });
      
      navigate('/checkout', { state: { cart_id: response.cart._id} });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12" style={{ backgroundColor: theme.muted }}>
        <div className="container-custom">
          <h1 className="font-playfair text-3xl md:text-4xl mb-8" style={{ color: theme.foreground }}>Your Cart</h1>
          
          {cart.length === 0 ? (
            <div className="p-8 text-center" style={{ backgroundColor: theme.background }}>
              <div className="flex justify-center mb-4">
                <ShoppingBag size={64} style={{ color: theme.mutedForeground }} />
              </div>
              <h2 className="text-xl font-medium mb-2" style={{ color: theme.foreground }}>Your cart is empty</h2>
              <p className="mb-6" style={{ color: theme.mutedForeground }}>Start adding items to your cart to see them here.</p>
              <Link 
                to="/browse/all" 
                className="inline-block px-6 py-3 transition-colors"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div style={{ backgroundColor: theme.background }}>
                  <div className="p-4 border-b" style={{ borderColor: theme.border }}>
                    <div className="grid grid-cols-8 gap-4">
                      <div className="col-span-4 md:col-span-5 text-sm md:text-base" style={{ color: theme.mutedForeground }}>Product</div>
                      <div className="col-span-2 md:col-span-1 text-sm md:text-base text-center" style={{ color: theme.mutedForeground }}>Quantity</div>
                      <div className="col-span-2 md:col-span-2 text-sm md:text-base text-right" style={{ color: theme.mutedForeground }}>Subtotal</div>
                    </div>
                  </div>
                  
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor?.name || 'default'}`} className="p-4 border-b" style={{ borderColor: theme.border }}>
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div className="col-span-4 md:col-span-5">
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden mr-4" style={{ backgroundColor: theme.muted }}>
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium" style={{ color: theme.foreground }}>{item.name}</h3>
                              <div className="flex flex-col md:flex-row md:items-center mt-1 text-sm" style={{ color: theme.mutedForeground }}>
                                {item.selectedColor && (
                                  <div className="flex items-center mt-1 md:mt-0">
                                    <span>Color:</span>
                                    <span 
                                      className="w-4 h-4 rounded-full inline-block ml-1 border border-gray-200" 
                                      style={{ backgroundColor: item.selectedColor.code }}
                                    ></span>
                                    <span className="ml-1">{item.selectedColor.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-span-2 md:col-span-1">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center border transition-colors"
                              style={{
                                borderColor: theme.border,
                                color: theme.mutedForeground,
                              }}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center mx-1" style={{ color: theme.foreground }}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border transition-colors"
                              style={{
                                borderColor: theme.border,
                                color: theme.mutedForeground,
                              }}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="col-span-2 md:col-span-2 text-right">
                          <div className="flex items-center justify-end">
                            <span className="font-medium" style={{ color: theme.foreground }}>${(item.price * item.quantity).toFixed(2)}</span>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 transition-colors"
                              style={{ color: theme.mutedForeground }}
                              aria-label="Remove item"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="p-6" style={{ backgroundColor: theme.background }}>
                  <h2 className="text-xl font-medium mb-4" style={{ color: theme.foreground }}>Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between" style={{ color: theme.mutedForeground }}>
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between" style={{ color: theme.mutedForeground }}>
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t flex justify-between font-medium" style={{ borderColor: theme.border, color: theme.foreground }}>
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || cart.length === 0}
                    className="w-full py-3 transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: theme.primary,
                      color: theme.primaryForeground,
                    }}
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
