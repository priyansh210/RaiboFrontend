
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, CreditCard, MapPin, ShoppingBag, Truck, Plus, Minus, X, Loader } from 'lucide-react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { paymentService } from '../services/PaymentService';
import { apiService } from '../services/ApiService';
import { Address } from '../api/types';
import { PaymentMethodDetails } from '../models/internal/Payment';

const StripeCheckout = () => {
  const navigate = useNavigate();
  const { cart, cartTotals, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<'review' | 'address' | 'payment' | 'confirm'>('review');
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    receiver_name: user?.firstName || '',
    receiver_phone: '',
  });
  
  // Payment state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDetails[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'stripe_checkout' | 'direct_payment'>('stripe_checkout');
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    card_number: '',
    card_holder: '',
    expiry_date: '',
    cvv: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/stripe-checkout' } });
      return;
    }
    
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    loadAddresses();
    loadPaymentMethods();
  }, [isAuthenticated, cart.length, navigate]);

  const loadAddresses = async () => {
    try {
      const addressData = await apiService.getAddresses();
      setAddresses(addressData);
      const defaultAddress = addressData.find((addr: Address) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods();
      setPaymentMethods(methods);
      const defaultMethod = methods.find(method => method.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      await apiService.addAddress(newAddress);
      await loadAddresses();
      setShowAddAddressForm(false);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
        receiver_name: user?.firstName || '',
        receiver_phone: '',
      });
      toast({
        title: "Address Added",
        description: "Your new address has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStripeCheckout = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Missing Information",
        description: "Please select a delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
      
      const checkoutSession = await paymentService.createCheckoutSession({
        items: cart.map(item => ({
          name: item.name,
          description: `Quantity: ${item.quantity}`,
          price: item.price,
          quantity: item.quantity,
          images: [item.image],
        })),
        customerEmail: user?.email,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
        shippingRequired: true,
        metadata: {
          cart_id: 'current_cart',
          address_id: selectedAddressId,
          customer_name: selectedAddress?.receiver_name || '',
          customer_phone: selectedAddress?.receiver_phone || '',
        },
      });

      // Redirect to Stripe Checkout
      window.location.href = checkoutSession.url;
      
    } catch (error) {
      console.error('Stripe checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "There was an error processing your checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectPayment = async () => {
    if (!selectedAddressId || !selectedPaymentMethodId) {
      toast({
        title: "Missing Information",
        description: "Please select an address and payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);
      
      // Create order first
      const orderData = {
        cart_id: "temp-cart-id",
        address_id: selectedAddressId,
        payment_method: selectedPaymentMethodId,
        receiver_name: selectedAddress?.receiver_name || '',
        receiver_phone: selectedAddress?.receiver_phone || '',
        method_id: selectedPaymentMethodId,
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const orderResponse = await apiService.createOrder(orderData);
      
      if (orderResponse.error) {
        throw new Error(orderResponse.error);
      }

      // Create payment intent
      const paymentDetails = await paymentService.createPaymentIntent({
        amount: cartTotals.total,
        currency: 'usd',
        orderId: orderResponse.id,
        paymentMethodId: selectedPaymentMethodId,
        shippingDetails: {
          name: selectedAddress?.receiver_name || '',
          phone: selectedAddress?.receiver_phone,
          address: {
            line1: selectedAddress?.street || '',
            city: selectedAddress?.city || '',
            state: selectedAddress?.state || '',
            postalCode: selectedAddress?.zip || '',
            country: selectedAddress?.country || 'US',
          },
        },
      });

      // Confirm the payment
      const confirmedPayment = await paymentService.confirmPayment(
        paymentDetails.id,
        selectedPaymentMethodId
      );

      if (confirmedPayment.status === 'succeeded') {
        await apiService.updateOrderStatus(orderResponse.id, 'placed');
        clearCart();
        
        toast({
          title: "Payment Successful",
          description: "Your order has been placed successfully.",
        });
        
        navigate('/checkout/success', { state: { orderId: orderResponse.id } });
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (error) {
      console.error('Direct payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 'review', label: 'Review Items', icon: ShoppingBag },
    { id: 'address', label: 'Delivery Address', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirm', label: 'Confirm Order', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <Layout>
      <div className="min-h-screen bg-cream py-8">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/cart" className="flex items-center text-earth hover:text-charcoal transition-colors">
              <ChevronLeft size={20} className="mr-2" />
              Back to Cart
            </Link>
            <h1 className="font-playfair text-3xl text-charcoal">Secure Checkout</h1>
            <div></div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      isActive ? 'border-terracotta bg-terracotta text-white' :
                      isCompleted ? 'border-olive bg-olive text-white' :
                      'border-sand bg-white text-earth'
                    }`}>
                      {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                    </div>
                    <span className={`ml-3 text-sm font-medium ${
                      isActive ? 'text-terracotta' :
                      isCompleted ? 'text-olive' :
                      'text-earth'
                    }`}>
                      {step.label}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`ml-8 w-16 h-0.5 ${
                        isCompleted ? 'bg-olive' : 'bg-sand'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Review */}
              {currentStep === 'review' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
                    <ShoppingBag size={20} className="mr-2" />
                    Review Your Items
                  </h2>
                  
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.selectedColor?.name}`} className="flex items-center space-x-4 p-4 border border-sand rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg bg-linen"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-charcoal">{item.name}</h3>
                          <p className="text-earth text-sm">Price: ${item.price}</p>
                          {item.selectedColor && (
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-earth mr-2">Color:</span>
                              <span 
                                className="w-4 h-4 rounded-full border border-gray-200" 
                                style={{ backgroundColor: item.selectedColor.code }}
                              ></span>
                              <span className="text-sm text-earth ml-1">{item.selectedColor.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-full border border-sand hover:border-terracotta flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-sand hover:border-terracotta flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-charcoal">${(item.price * item.quantity).toFixed(2)}</p>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-earth hover:text-terracotta mt-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setCurrentStep('address')}
                      className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-umber transition-colors"
                    >
                      Continue to Address
                    </button>
                  </div>
                </div>
              )}

              {/* Address Selection */}
              {currentStep === 'address' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
                    <MapPin size={20} className="mr-2" />
                    Delivery Address
                  </h2>
                  
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAddressId === address._id ? 'border-terracotta bg-terracotta/5' : 'border-sand hover:border-terracotta/50'
                        }`}
                        onClick={() => setSelectedAddressId(address._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-charcoal">{address.receiver_name}</p>
                            <p className="text-earth text-sm">{address.street}</p>
                            <p className="text-earth text-sm">{address.city}, {address.state} {address.zip}</p>
                            <p className="text-earth text-sm">{address.receiver_phone}</p>
                          </div>
                          <input
                            type="radio"
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Address Form */}
                    {!showAddAddressForm ? (
                      <button
                        onClick={() => setShowAddAddressForm(true)}
                        className="w-full p-4 border-2 border-dashed border-sand hover:border-terracotta rounded-lg text-earth hover:text-terracotta transition-colors flex items-center justify-center"
                      >
                        <Plus size={20} className="mr-2" />
                        Add New Address
                      </button>
                    ) : (
                      <div className="p-4 border border-sand rounded-lg">
                        <h3 className="font-medium text-charcoal mb-4">Add New Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Receiver Name"
                            value={newAddress.receiver_name}
                            onChange={(e) => setNewAddress({ ...newAddress, receiver_name: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={newAddress.receiver_phone}
                            onChange={(e) => setNewAddress({ ...newAddress, receiver_phone: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <input
                            type="text"
                            placeholder="Street Address"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            className="md:col-span-2 px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <input
                            type="text"
                            placeholder="ZIP Code"
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <select
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                          </select>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={handleAddAddress}
                            className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-umber transition-colors"
                          >
                            Save Address
                          </button>
                          <button
                            onClick={() => setShowAddAddressForm(false)}
                            className="px-4 py-2 border border-sand text-earth rounded-lg hover:border-terracotta transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setCurrentStep('review')}
                      className="px-6 py-3 border border-sand text-earth rounded-lg hover:border-terracotta transition-colors"
                    >
                      Back to Review
                    </button>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      disabled={!selectedAddressId}
                      className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-umber transition-colors disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              {currentStep === 'payment' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Payment Method
                  </h2>
                  
                  {/* Payment Mode Selection */}
                  <div className="mb-6">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setPaymentMode('stripe_checkout')}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          paymentMode === 'stripe_checkout' 
                            ? 'border-terracotta bg-terracotta/5 text-terracotta' 
                            : 'border-sand text-earth hover:border-terracotta/50'
                        }`}
                      >
                        Stripe Checkout (Recommended)
                      </button>
                      <button
                        onClick={() => setPaymentMode('direct_payment')}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          paymentMode === 'direct_payment' 
                            ? 'border-terracotta bg-terracotta/5 text-terracotta' 
                            : 'border-sand text-earth hover:border-terracotta/50'
                        }`}
                      >
                        Direct Payment
                      </button>
                    </div>
                  </div>

                  {paymentMode === 'stripe_checkout' ? (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <CreditCard size={48} className="mx-auto text-terracotta" />
                      </div>
                      <h3 className="text-lg font-medium text-charcoal mb-2">Secure Stripe Checkout</h3>
                      <p className="text-earth mb-6">
                        You'll be redirected to Stripe's secure checkout page to complete your payment.
                      </p>
                      <button
                        onClick={handleStripeCheckout}
                        disabled={isLoading || !selectedAddressId}
                        className="bg-terracotta text-white px-8 py-3 rounded-lg hover:bg-umber transition-colors disabled:opacity-50 font-medium flex items-center mx-auto"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="animate-spin mr-2" size={16} />
                            Processing...
                          </>
                        ) : (
                          'Proceed to Stripe Checkout'
                        )}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedPaymentMethodId === method.id ? 'border-terracotta bg-terracotta/5' : 'border-sand hover:border-terracotta/50'
                            }`}
                            onClick={() => setSelectedPaymentMethodId(method.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-charcoal">**** **** **** {method.card.last4}</p>
                                <p className="text-earth text-sm">{method.billingDetails.name}</p>
                                <p className="text-earth text-sm">Expires: {method.card.expiryMonth}/{method.card.expiryYear}</p>
                              </div>
                              <input
                                type="radio"
                                checked={selectedPaymentMethodId === method.id}
                                onChange={() => setSelectedPaymentMethodId(method.id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => setCurrentStep('address')}
                          className="px-6 py-3 border border-sand text-earth rounded-lg hover:border-terracotta transition-colors"
                        >
                          Back to Address
                        </button>
                        <button
                          onClick={handleDirectPayment}
                          disabled={isLoading || !selectedAddressId || !selectedPaymentMethodId}
                          className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-umber transition-colors disabled:opacity-50 font-medium flex items-center"
                        >
                          {isLoading ? (
                            <>
                              <Loader className="animate-spin mr-2" size={16} />
                              Processing...
                            </>
                          ) : (
                            'Complete Payment'
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-charcoal mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-earth">
                    <span>Subtotal ({cart.length} items)</span>
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
                  <div className="border-t border-sand pt-3">
                    <div className="flex justify-between text-lg font-semibold text-charcoal">
                      <span>Total</span>
                      <span>${cartTotals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-earth text-center">
                  <p className="flex items-center justify-center mb-2">
                    <Truck size={16} className="mr-1" />
                    Free shipping on orders over $100
                  </p>
                  <p>Secure payment powered by Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StripeCheckout;
