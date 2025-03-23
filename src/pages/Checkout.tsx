
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CreditCard, Check, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'review';

const Checkout = () => {
  const { cartItems, cartTotals, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [formData, setFormData] = useState({
    // Contact information
    email: user?.email || '',
    phone: '',
    
    // Shipping address
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Shipping method
    shippingMethod: 'standard',
    
    // Payment information
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingAddressSame: true,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  const validateStep = (): boolean => {
    switch (currentStep) {
      case 'information':
        if (!formData.email || !formData.phone) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      
      case 'shipping':
        if (
          !formData.firstName || 
          !formData.lastName || 
          !formData.address || 
          !formData.city || 
          !formData.state || 
          !formData.zipCode
        ) {
          toast({
            title: "Missing Address Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      
      case 'payment':
        if (
          !formData.cardName || 
          !formData.cardNumber || 
          !formData.cardExpiry || 
          !formData.cardCvc
        ) {
          toast({
            title: "Missing Payment Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };
  
  const nextStep = () => {
    if (!validateStep()) return;
    
    switch (currentStep) {
      case 'information':
        setCurrentStep('shipping');
        break;
      case 'shipping':
        setCurrentStep('payment');
        break;
      case 'payment':
        setCurrentStep('review');
        break;
      case 'review':
        handlePlaceOrder();
        break;
    }
  };
  
  const prevStep = () => {
    switch (currentStep) {
      case 'shipping':
        setCurrentStep('information');
        break;
      case 'payment':
        setCurrentStep('shipping');
        break;
      case 'review':
        setCurrentStep('payment');
        break;
    }
  };
  
  const handlePlaceOrder = () => {
    // Simulate order placement
    setTimeout(() => {
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed. Thank you for shopping with us!",
      });
      navigate('/order-confirmation');
    }, 1500);
  };
  
  // Guard: redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container-custom py-10">
          <div className="bg-white p-8 text-center rounded-sm">
            <AlertCircle size={40} className="mx-auto text-terracotta mb-4" />
            <h2 className="text-xl font-medium text-charcoal mb-2">Your cart is empty</h2>
            <p className="text-earth mb-6">
              You need to add some items to your cart before checking out.
            </p>
            <Link 
              to="/browse" 
              className="inline-flex items-center bg-terracotta hover:bg-umber text-white py-2 px-4 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom">
          <div className="mb-8">
            <Link to="/cart" className="inline-flex items-center text-earth hover:text-terracotta transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              <span>Return to cart</span>
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Content */}
            <div className="md:w-3/5 lg:w-2/3">
              <div className="bg-white p-6 rounded-sm animate-fade-in">
                <h1 className="font-playfair text-2xl text-charcoal mb-6">Checkout</h1>
                
                {/* Checkout Steps */}
                <div className="mb-8 overflow-hidden">
                  <div className="flex border-b border-taupe/10">
                    {[
                      { id: 'information', label: 'Information' },
                      { id: 'shipping', label: 'Shipping' },
                      { id: 'payment', label: 'Payment' },
                      { id: 'review', label: 'Review' },
                    ].map((step, index) => (
                      <div 
                        key={step.id}
                        className={`flex-1 text-center py-3 text-sm font-medium relative ${
                          currentStep === step.id 
                            ? 'text-terracotta border-b-2 border-terracotta' 
                            : 'text-earth'
                        }`}
                      >
                        <span className="relative z-10">{step.label}</span>
                        
                        {index < 3 && (
                          <span className="absolute top-1/2 right-0 w-6 h-px bg-taupe/10 transform -translate-y-1/2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Information Step */}
                {currentStep === 'information' && (
                  <div className="animate-fade-in">
                    <h2 className="font-medium text-lg text-charcoal mb-4">Contact Information</h2>
                    
                    {!isAuthenticated && (
                      <p className="text-sm text-earth mb-4">
                        Already have an account? <Link to="/login" className="text-terracotta hover:underline">Log in</Link>
                      </p>
                    )}
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="email" className="block text-sm text-earth mb-1">
                          Email address *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm text-earth mb-1">
                          Phone number *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                        <p className="text-xs text-earth mt-1">
                          For delivery questions only
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={nextStep}
                        className="bg-terracotta hover:bg-umber text-white py-2 px-6 transition-colors"
                      >
                        Continue to Shipping
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <div className="animate-fade-in">
                    <h2 className="font-medium text-lg text-charcoal mb-4">Shipping Address</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm text-earth mb-1">
                          First name *
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm text-earth mb-1">
                          Last name *
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm text-earth mb-1">
                          Address *
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="apartment" className="block text-sm text-earth mb-1">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          id="apartment"
                          name="apartment"
                          type="text"
                          value={formData.apartment}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm text-earth mb-1">
                          City *
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm text-earth mb-1">
                          State/Province *
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm text-earth mb-1">
                          Zip/Postal code *
                        </label>
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm text-earth mb-1">
                          Country *
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-lg text-charcoal mb-4">Shipping Method</h3>
                    
                    <div className="space-y-3 mb-6">
                      <label className="flex items-start p-3 border border-taupe/30 cursor-pointer">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <span className="font-medium text-charcoal">Standard Shipping</span>
                            {cartTotals.subtotal > 1000 ? (
                              <span className="text-green-600">Free</span>
                            ) : (
                              <span>$99.00</span>
                            )}
                          </div>
                          <p className="text-sm text-earth">
                            Delivery in 5-7 business days
                          </p>
                        </div>
                      </label>
                      
                      <label className="flex items-start p-3 border border-taupe/30 cursor-pointer">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <span className="font-medium text-charcoal">Express Shipping</span>
                            <span>$129.00</span>
                          </div>
                          <p className="text-sm text-earth">
                            Delivery in 2-3 business days
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={prevStep}
                        className="text-earth hover:text-terracotta transition-colors"
                      >
                        Return to information
                      </button>
                      
                      <button
                        onClick={nextStep}
                        className="bg-terracotta hover:bg-umber text-white py-2 px-6 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <div className="animate-fade-in">
                    <h2 className="font-medium text-lg text-charcoal mb-4">Payment Information</h2>
                    
                    <div className="p-4 bg-linen mb-6">
                      <div className="flex items-center mb-2">
                        <CreditCard size={18} className="text-terracotta mr-2" />
                        <span className="font-medium text-charcoal">Credit Card</span>
                      </div>
                      <p className="text-sm text-earth">
                        All transactions are secure and encrypted. Credit card information is never stored.
                      </p>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="cardName" className="block text-sm text-earth mb-1">
                          Name on card *
                        </label>
                        <input
                          id="cardName"
                          name="cardName"
                          type="text"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm text-earth mb-1">
                          Card number *
                        </label>
                        <input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm text-earth mb-1">
                            Expiration date (MM/YY) *
                          </label>
                          <input
                            id="cardExpiry"
                            name="cardExpiry"
                            type="text"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cardCvc" className="block text-sm text-earth mb-1">
                            CVC *
                          </label>
                          <input
                            id="cardCvc"
                            name="cardCvc"
                            type="text"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={handleInputChange}
                            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm text-earth">
                          <input
                            type="checkbox"
                            name="billingAddressSame"
                            checked={formData.billingAddressSame}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          <span>Billing address same as shipping address</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={prevStep}
                        className="text-earth hover:text-terracotta transition-colors"
                      >
                        Return to shipping
                      </button>
                      
                      <button
                        onClick={nextStep}
                        className="bg-terracotta hover:bg-umber text-white py-2 px-6 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div className="animate-fade-in">
                    <h2 className="font-medium text-lg text-charcoal mb-4">Review Your Order</h2>
                    
                    {/* Contact Information */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-charcoal">Contact Information</h3>
                        <button
                          onClick={() => setCurrentStep('information')}
                          className="text-xs text-terracotta hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-linen p-3">
                        <p className="text-sm text-earth">{formData.email}</p>
                        <p className="text-sm text-earth">{formData.phone}</p>
                      </div>
                    </div>
                    
                    {/* Shipping Address */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-charcoal">Shipping Address</h3>
                        <button
                          onClick={() => setCurrentStep('shipping')}
                          className="text-xs text-terracotta hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-linen p-3">
                        <p className="text-sm text-earth">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-sm text-earth">
                          {formData.address} {formData.apartment && `, ${formData.apartment}`}
                        </p>
                        <p className="text-sm text-earth">
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p className="text-sm text-earth">{formData.country}</p>
                      </div>
                    </div>
                    
                    {/* Shipping Method */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-charcoal">Shipping Method</h3>
                        <button
                          onClick={() => setCurrentStep('shipping')}
                          className="text-xs text-terracotta hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-linen p-3">
                        <p className="text-sm text-earth">
                          {formData.shippingMethod === 'standard' 
                            ? 'Standard Shipping (5-7 business days)' 
                            : 'Express Shipping (2-3 business days)'}
                          {' - '}
                          {formData.shippingMethod === 'standard' && cartTotals.subtotal > 1000 
                            ? 'Free' 
                            : formData.shippingMethod === 'standard' 
                              ? '$99.00' 
                              : '$129.00'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Payment Method */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-charcoal">Payment Method</h3>
                        <button
                          onClick={() => setCurrentStep('payment')}
                          className="text-xs text-terracotta hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-linen p-3">
                        <p className="text-sm text-earth">
                          Credit Card ending in {formData.cardNumber.slice(-4)}
                        </p>
                        <p className="text-sm text-earth">
                          Expires {formData.cardExpiry}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-medium text-charcoal mb-2">Order Items</h3>
                      <div className="border border-taupe/10 divide-y divide-taupe/10">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center p-3">
                            <div className="w-16 h-16 flex-shrink-0 bg-linen overflow-hidden">
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-grow">
                              <h4 className="font-medium text-sm text-charcoal">{item.name}</h4>
                              <p className="text-xs text-earth">
                                Color: {item.selectedColor.name} | Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-sm text-charcoal">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Terms & Conditions */}
                    <div className="mb-6">
                      <label className="flex items-start text-sm text-earth">
                        <input
                          type="checkbox"
                          className="mt-1 mr-2"
                          required
                        />
                        <span>
                          I agree to the <Link to="/terms" className="text-terracotta hover:underline">Terms and Conditions</Link>, <Link to="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>, and <Link to="/returns" className="text-terracotta hover:underline">Return Policy</Link>.
                        </span>
                      </label>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={prevStep}
                        className="text-earth hover:text-terracotta transition-colors"
                      >
                        Return to payment
                      </button>
                      
                      <button
                        onClick={nextStep}
                        className="bg-terracotta hover:bg-umber text-white py-2 px-6 transition-colors"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="md:w-2/5 lg:w-1/3">
              <div className="bg-white p-6 rounded-sm animate-fade-in">
                <h2 className="font-medium text-lg text-charcoal mb-4">Order Summary</h2>
                
                {/* Order Items */}
                <div className="max-h-80 overflow-y-auto mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center py-3 border-b border-taupe/10 last:border-b-0">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-linen overflow-hidden">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-0 right-0 bg-terracotta text-white text-xs w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="ml-3 flex-grow">
                        <h4 className="text-sm font-medium text-charcoal">{item.name}</h4>
                        <p className="text-xs text-earth">Color: {item.selectedColor.name}</p>
                      </div>
                      <div className="text-sm text-charcoal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="border-t border-taupe/10 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-earth">Subtotal</span>
                    <span className="text-charcoal">${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-earth">Shipping</span>
                    {cartTotals.shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span className="text-charcoal">${cartTotals.shipping.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-earth">Tax</span>
                    <span className="text-charcoal">${cartTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-taupe/10 pt-3 flex justify-between font-medium">
                    <span className="text-charcoal">Total</span>
                    <span className="text-lg text-charcoal">${cartTotals.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-grow py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                    />
                    <button className="bg-sand hover:bg-taupe text-charcoal hover:text-white py-2 px-4 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
