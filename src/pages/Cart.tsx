
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotals } = useCart();
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-8">
            Your Cart
          </h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-sm animate-fade-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-linen flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-terracotta" />
              </div>
              <h2 className="text-xl font-medium text-charcoal mb-2">Your cart is empty</h2>
              <p className="text-earth mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link 
                to="/browse" 
                className="inline-flex items-center bg-terracotta hover:bg-umber text-white py-3 px-6 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-sm overflow-hidden animate-fade-in">
                  <div className="hidden md:grid grid-cols-[3fr,1fr,1fr,auto] p-4 border-b border-taupe/10 bg-linen">
                    <div className="text-sm font-medium text-charcoal">Product</div>
                    <div className="text-sm font-medium text-charcoal text-center">Price</div>
                    <div className="text-sm font-medium text-charcoal text-center">Quantity</div>
                    <div className="text-sm font-medium text-charcoal text-right pr-4">Total</div>
                  </div>
                  
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-b border-taupe/10 last:border-0">
                      <div className="md:grid md:grid-cols-[3fr,1fr,1fr,auto] p-4 items-center">
                        {/* Product */}
                        <div className="flex mb-4 md:mb-0">
                          <div className="w-20 h-20 flex-shrink-0 bg-linen overflow-hidden">
                            <img 
                              src={item.images[0]} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <Link 
                              to={`/product/${item.id}`} 
                              className="font-medium text-charcoal hover:text-terracotta transition-colors"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-earth">{item.brand}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-earth mr-2">Color:</span>
                              <span 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: item.selectedColor.code }}
                                title={item.selectedColor.name}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="md:text-center mb-2 md:mb-0">
                          <div className="flex justify-between md:block">
                            <span className="text-sm font-medium text-earth md:hidden">Price:</span>
                            <span className="text-charcoal">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {/* Quantity */}
                        <div className="md:text-center mb-2 md:mb-0">
                          <div className="flex justify-between md:justify-center items-center">
                            <span className="text-sm font-medium text-earth md:hidden">Quantity:</span>
                            <div className="flex items-center border border-taupe/30">
                              <button 
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="py-1 px-2 text-earth hover:text-terracotta"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="py-1 px-3 text-charcoal border-l border-r border-taupe/30">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="py-1 px-2 text-earth hover:text-terracotta"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Total and Remove */}
                        <div className="flex justify-between items-center md:block md:text-right">
                          <div className="flex md:hidden justify-between w-full">
                            <span className="text-sm font-medium text-earth">Total:</span>
                            <span className="font-medium text-charcoal">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="hidden md:block font-medium text-charcoal mb-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-earth hover:text-terracotta transition-colors"
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link 
                    to="/browse" 
                    className="inline-flex items-center text-terracotta hover:text-umber transition-colors"
                  >
                    <ArrowRight size={16} className="mr-1 transform rotate-180" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white p-6 rounded-sm animate-fade-in">
                  <h2 className="font-medium text-xl text-charcoal mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-earth">Subtotal</span>
                      <span className="text-charcoal">${cartTotals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth">Shipping</span>
                      {cartTotals.shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span className="text-charcoal">${cartTotals.shipping.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-earth">Tax</span>
                      <span className="text-charcoal">${cartTotals.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-taupe/10 pt-3 flex justify-between font-medium">
                      <span className="text-charcoal">Total</span>
                      <span className="text-charcoal">${cartTotals.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <label htmlFor="promo-code" className="block text-sm text-earth mb-2">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        id="promo-code"
                        type="text"
                        placeholder="Enter code"
                        className="flex-grow py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                      />
                      <button className="bg-sand hover:bg-taupe text-charcoal hover:text-white py-2 px-4 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link 
                    to="/checkout" 
                    className="block w-full bg-terracotta hover:bg-umber text-white py-3 px-4 text-center transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  {/* Additional Info */}
                  <div className="mt-6 text-xs text-earth space-y-2">
                    <p>
                      Free shipping on orders over $1,000
                    </p>
                    <p>
                      30-day return policy for most items
                    </p>
                    <p>
                      Taxes calculated at checkout based on delivery address
                    </p>
                  </div>
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
