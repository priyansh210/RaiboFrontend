
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Check, ChevronLeft, CreditCard, MapPin, ShoppingBag, Truck } from 'lucide-react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ordersApi } from '../api/mockApi';

// Step interface
interface CheckoutStep {
  id: string;
  title: string;
  icon: React.ReactNode;
}

// Address interface
interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Payment method interface
interface PaymentMethod {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartTotals, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<string>('shipping');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  
  // Form states
  const [address, setAddress] = useState<Address>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
  });
  
  // Checkout steps
  const steps: CheckoutStep[] = [
    {
      id: 'shipping',
      title: 'Shipping',
      icon: <MapPin size={18} className="mr-2" />,
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: <CreditCard size={18} className="mr-2" />,
    },
    {
      id: 'review',
      title: 'Review',
      icon: <ShoppingBag size={18} className="mr-2" />,
    },
  ];
  
  // Check if we're on the success page
  useEffect(() => {
    const isSuccess = location.pathname === '/checkout/success';
    
    if (isSuccess) {
      setOrderPlaced(true);
      const orderIdFromState = location.state?.orderId;
      if (orderIdFromState) {
        setOrderId(orderIdFromState);
      }
    }
    
    // Redirect if cart is empty and not on success page
    if (cart.length === 0 && !isSuccess && !orderPlaced) {
      navigate('/cart');
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checking out.",
      });
    }
    
    // Redirect if not authenticated
    if (!isAuthenticated && !isSuccess) {
      navigate('/login', { state: { redirect: '/checkout' } });
      toast({
        title: "Login Required",
        description: "Please log in to continue with checkout.",
      });
    }
  }, [isAuthenticated, cart.length, location, navigate, orderPlaced]);
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    const { firstName, lastName, address1, city, state, postalCode, country, phone } = address;
    
    if (!firstName || !lastName || !address1 || !city || !state || !postalCode || !country || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    const { cardNumber, nameOnCard, expiryDate, cvv } = paymentMethod;
    
    if (!cardNumber || !nameOnCard || !expiryDate || !cvv) {
      toast({
        title: "Missing Payment Information",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const placeOrder = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to place an order.",
        variant: "destructive",
      });
      navigate('/login', { state: { redirect: '/checkout' } });
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
      
      // Format address
      const shippingAddress = `${address.firstName} ${address.lastName}, ${address.address1}${
        address.address2 ? `, ${address.address2}` : ''
      }, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
      
      // Create a new order
      const response = await ordersApi.createOrder({
        buyer_id: user.id,
        total_amount: cartTotals.total,
        shipping_address: shippingAddress,
        status: 'pending',
        items: orderItems
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Set order ID and status
      setOrderId(response.data?.id || '');
      setOrderPlaced(true);
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/checkout/success', { state: { orderId: response.data?.id } });
      
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (currentStep === 'shipping') {
      setAddress(prev => ({ ...prev, [name]: value }));
    } else if (currentStep === 'payment') {
      setPaymentMethod(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Format credit card number
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };
  
  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    setPaymentMethod(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
  };
  
  // Handle expiry date input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setPaymentMethod(prev => ({ ...prev, expiryDate: value }));
  };
  
  // Handle CVV input
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setPaymentMethod(prev => ({ ...prev, cvv: value }));
  };
  
  // If we're on the success page or order is placed
  if (orderPlaced || location.pathname === '/checkout/success') {
    return (
      <Layout>
        <div className="min-h-screen bg-cream py-12">
          <div className="container-custom max-w-3xl">
            <div className="bg-white p-8 rounded-sm shadow-sm text-center">
              <div className="mx-auto w-16 h-16 mb-6 bg-olive/20 rounded-full flex items-center justify-center">
                <Check size={32} className="text-olive" />
              </div>
              
              <h1 className="font-playfair text-3xl text-charcoal mb-4">Order Confirmed!</h1>
              <p className="text-earth mb-6">
                Thank you for your purchase. We've received your order and it's being processed.
              </p>
              
              <div className="bg-sand/20 p-6 rounded-sm mb-8">
                <p className="text-sm text-earth mb-2">Order ID:</p>
                <p className="font-medium text-charcoal">{orderId || 'N/A'}</p>
                <p className="text-sm text-earth mt-4 mb-2">Order Date:</p>
                <p className="font-medium text-charcoal">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Link
                  to="/"
                  className="bg-terracotta text-white px-6 py-3 hover:bg-umber transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/account"
                  className="bg-transparent text-charcoal border border-taupe/30 px-6 py-3 hover:bg-sand/20 transition-colors"
                >
                  View Order History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Steps */}
            <div className="lg:w-2/3">
              <div className="flex justify-between mb-6">
                <Link to="/cart" className="flex items-center text-earth hover:text-charcoal">
                  <ChevronLeft size={16} className="mr-1" />
                  Back to Cart
                </Link>
                <h1 className="font-playfair text-2xl text-charcoal hidden md:block">Checkout</h1>
              </div>
              
              <div className="bg-white p-8 rounded-sm shadow-sm mb-8">
                <div className="flex border-b border-taupe/20 pb-4 mb-6">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex-1">
                        <div
                          className={`flex items-center justify-center flex-col md:flex-row ${
                            currentStep === step.id
                              ? 'text-terracotta'
                              : steps.findIndex(s => s.id === currentStep) > index
                              ? 'text-olive'
                              : 'text-earth'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 md:mb-0 ${
                              currentStep === step.id
                                ? 'bg-terracotta/10 border border-terracotta'
                                : steps.findIndex(s => s.id === currentStep) > index
                                ? 'bg-olive/10 border border-olive'
                                : 'border border-taupe/30'
                            }`}
                          >
                            {steps.findIndex(s => s.id === currentStep) > index ? (
                              <Check size={16} />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <span className="md:ml-2 text-sm">{step.title}</span>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-6 flex items-center justify-center">
                          <div className="border-t border-taupe/30 w-full"></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Shipping Step */}
                {currentStep === 'shipping' && (
                  <form onSubmit={handleShippingSubmit}>
                    <h2 className="text-xl font-medium text-charcoal mb-6">Shipping Address</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm text-earth mb-1">
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={address.firstName}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm text-earth mb-1">
                          Last Name *
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={address.lastName}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address1" className="block text-sm text-earth mb-1">
                          Street Address *
                        </label>
                        <input
                          id="address1"
                          name="address1"
                          type="text"
                          value={address.address1}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="address2" className="block text-sm text-earth mb-1">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          id="address2"
                          name="address2"
                          type="text"
                          value={address.address2}
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
                          value={address.city}
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
                          value={address.state}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postalCode" className="block text-sm text-earth mb-1">
                          ZIP/Postal Code *
                        </label>
                        <input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={address.postalCode}
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
                          value={address.country}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="Mexico">Mexico</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm text-earth mb-1">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={address.phone}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        className="bg-terracotta hover:bg-umber text-white px-6 py-3 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Payment Step */}
                {currentStep === 'payment' && (
                  <form onSubmit={handlePaymentSubmit}>
                    <h2 className="text-xl font-medium text-charcoal mb-6">Payment Information</h2>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm text-earth mb-1">
                          Card Number *
                        </label>
                        <input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          value={paymentMethod.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="nameOnCard" className="block text-sm text-earth mb-1">
                          Name on Card *
                        </label>
                        <input
                          id="nameOnCard"
                          name="nameOnCard"
                          type="text"
                          value={paymentMethod.nameOnCard}
                          onChange={handleInputChange}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm text-earth mb-1">
                            Expiry Date (MM/YY) *
                          </label>
                          <input
                            id="expiryDate"
                            name="expiryDate"
                            type="text"
                            value={paymentMethod.expiryDate}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvv" className="block text-sm text-earth mb-1">
                            CVV *
                          </label>
                          <input
                            id="cvv"
                            name="cvv"
                            type="text"
                            value={paymentMethod.cvv}
                            onChange={handleCVVChange}
                            placeholder="123"
                            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-earth">
                          For demo purposes, you can use any valid-looking credit card number.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('shipping')}
                        className="bg-transparent text-charcoal border border-taupe/30 px-6 py-3 hover:bg-sand/20 transition-colors"
                      >
                        Back to Shipping
                      </button>
                      <button
                        type="submit"
                        className="bg-terracotta hover:bg-umber text-white px-6 py-3 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Review Step */}
                {currentStep === 'review' && (
                  <div>
                    <h2 className="text-xl font-medium text-charcoal mb-6">Review Your Order</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-taupe/20 rounded-sm p-4">
                        <div className="flex items-center mb-3">
                          <MapPin size={18} className="text-terracotta mr-2" />
                          <h3 className="font-medium">Shipping Address</h3>
                        </div>
                        <p className="text-earth">
                          {address.firstName} {address.lastName}<br />
                          {address.address1}
                          {address.address2 && <><br />{address.address2}</>}<br />
                          {address.city}, {address.state} {address.postalCode}<br />
                          {address.country}<br />
                          {address.phone}
                        </p>
                        <button
                          onClick={() => setCurrentStep('shipping')}
                          className="text-sm text-terracotta hover:underline mt-2"
                        >
                          Edit
                        </button>
                      </div>
                      
                      <div className="border border-taupe/20 rounded-sm p-4">
                        <div className="flex items-center mb-3">
                          <CreditCard size={18} className="text-terracotta mr-2" />
                          <h3 className="font-medium">Payment Method</h3>
                        </div>
                        <p className="text-earth">
                          {paymentMethod.cardNumber}<br />
                          {paymentMethod.nameOnCard}<br />
                          Expires: {paymentMethod.expiryDate}
                        </p>
                        <button
                          onClick={() => setCurrentStep('payment')}
                          className="text-sm text-terracotta hover:underline mt-2"
                        >
                          Edit
                        </button>
                      </div>
                      
                      <div className="border border-taupe/20 rounded-sm p-4">
                        <div className="flex items-center mb-3">
                          <Truck size={18} className="text-terracotta mr-2" />
                          <h3 className="font-medium">Shipping Method</h3>
                        </div>
                        <p className="text-earth">
                          Standard Shipping (3-5 business days)<br />
                          ${cartTotals.shipping.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('payment')}
                        className="bg-transparent text-charcoal border border-taupe/30 px-6 py-3 hover:bg-sand/20 transition-colors"
                      >
                        Back to Payment
                      </button>
                      <button
                        type="button"
                        onClick={placeOrder}
                        disabled={isLoading}
                        className="bg-terracotta hover:bg-umber text-white px-6 py-3 transition-colors disabled:bg-taupe"
                      >
                        {isLoading ? 'Processing...' : 'Place Order'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
                <h2 className="text-xl font-medium text-charcoal mb-4">Order Summary</h2>
                
                <div className="max-h-72 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor?.name}`} className="flex py-3 border-b border-taupe/10">
                      <div className="w-16 h-16 flex-shrink-0 bg-linen overflow-hidden mr-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-charcoal">{item.name}</p>
                        <div className="flex items-center text-sm text-earth mt-1">
                          <span>Qty: {item.quantity}</span>
                          {item.selectedColor && (
                            <span className="flex items-center ml-3">
                              Color: 
                              <span 
                                className="w-3 h-3 rounded-full inline-block ml-1 border border-gray-200" 
                                style={{ backgroundColor: item.selectedColor.code }}
                              ></span>
                            </span>
                          )}
                        </div>
                        <p className="text-earth font-medium mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 py-4 border-b border-taupe/20">
                  <div className="flex justify-between text-earth">
                    <span>Subtotal</span>
                    <span>${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-earth">
                    <span>Shipping</span>
                    <span>${cartTotals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-earth">
                    <span>Tax</span>
                    <span>${cartTotals.tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-medium text-lg text-charcoal py-4">
                  <span>Total</span>
                  <span>${cartTotals.total.toFixed(2)}</span>
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
