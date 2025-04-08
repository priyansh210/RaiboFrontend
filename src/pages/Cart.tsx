import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ordersApi } from '../api/mockApi';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
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
      
      // Create a new order
      const response = await ordersApi.createOrder({
        buyer_id: user.id,
        total_amount: total,
        shipping_address: 'Default Address', // In a real app, you'd collect this
        status: 'pending',
        items: orderItems
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Clear the cart
      clearCart();
      
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });
      
      navigate('/checkout/success', { state: { orderId: response.data?.id } });
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
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-8">Your Cart</h1>
          
          {cart.length === 0 ? (
            <div className="bg-white p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag size={64} className="text-earth" />
              </div>
              <h2 className="text-xl font-medium text-charcoal mb-2">Your cart is empty</h2>
              <p className="text-earth mb-6">Start adding items to your cart to see them here.</p>
              <Link 
                to="/browse/all" 
                className="inline-block bg-terracotta text-white px-6 py-3 hover:bg-umber transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white">
                  <div className="p-4 border-b border-sand">
                    <div className="grid grid-cols-8 gap-4">
                      <div className="col-span-4 md:col-span-5 text-earth text-sm md:text-base">Product</div>
                      <div className="col-span-2 md:col-span-1 text-earth text-sm md:text-base text-center">Quantity</div>
                      <div className="col-span-2 md:col-span-2 text-earth text-sm md:text-base text-right">Subtotal</div>
                    </div>
                  </div>
                  
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor?.name || 'default'}`} className="p-4 border-b border-sand">
                      <div className="grid grid-cols-8 gap-4 items-center">
                        <div className="col-span-4 md:col-span-5">
                          <div className="flex items-center">
                            <div className="w-16 h-16 flex-shrink-0 bg-linen overflow-hidden mr-4">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-charcoal">{item.name}</h3>
                              <div className="flex flex-col md:flex-row md:items-center mt-1 text-sm text-earth">
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
                              className="w-8 h-8 flex items-center justify-center border border-sand hover:border-terracotta text-earth hover:text-terracotta transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center mx-1">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-sand hover:border-terracotta text-earth hover:text-terracotta transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="col-span-2 md:col-span-2 text-right">
                          <div className="flex items-center justify-end">
                            <span className="font-medium text-charcoal">${(item.price * item.quantity).toFixed(2)}</span>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="ml-4 text-earth hover:text-terracotta transition-colors"
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
                <div className="bg-white p-6">
                  <h2 className="text-xl font-medium text-charcoal mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-earth">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-earth">
                      <span>Shipping</span>
                      <span>${shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-sand flex justify-between font-medium text-charcoal">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || cart.length === 0}
                    className="w-full bg-terracotta hover:bg-umber text-white py-3 transition-colors disabled:opacity-50"
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
