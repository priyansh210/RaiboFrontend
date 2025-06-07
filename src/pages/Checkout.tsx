import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, CreditCard, MapPin, ShoppingBag, Truck, Plus, Minus, X, Edit } from 'lucide-react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { apiService } from '../services/ApiService';
import { Address, PaymentMethod } from '../api/types';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  receiver_name: string;
  receiver_phone: string;
  is_default?: boolean;
}

interface PaymentMethod {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotals, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<string>('review');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    card_number: '',
    card_holder: '',
    expiry_date: '',
    cvv: '',
    card_type: 'visa',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: '/checkout' } });
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
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const paymentData = await apiService.getPaymentMethods();
      setPaymentMethods(paymentData);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await apiService.addAddress(newAddress);
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

  const handleAddPaymentMethod = async () => {
    try {
      const response = await apiService.addPaymentMethod(newPaymentMethod);
      await loadPaymentMethods();
      setShowAddPaymentForm(false);
      setNewPaymentMethod({
        card_number: '',
        card_holder: '',
        expiry_date: '',
        cvv: '',
        card_type: 'visa',
      });
      toast({
        title: "Payment Method Added",
        description: "Your new payment method has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePlaceOrder = async () => {
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
      // Create order
      const orderData = {
        cart_id: 'temp-cart-id',
        address_id: selectedAddressId,
        payment_method: selectedPaymentMethodId,
        receiver_name: addresses.find(a => a.id === selectedAddressId)?.receiver_name || '',
        receiver_phone: addresses.find(a => a.id === selectedAddressId)?.receiver_phone || '',
        method_id: selectedPaymentMethodId,
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

      const orderResponse = await apiService.createOrder(orderData);
      
      if (orderResponse.error) {
        throw new Error(orderResponse.error);
      }

      // Process payment
      const paymentResponse = await apiService.processPayment({
        order_id: orderResponse.id,
        payment_method_id: selectedPaymentMethodId,
        amount: Math.round(cartTotals.total * 100), // Convert to cents
        currency: 'usd',
      });

      if (paymentResponse.success) {
        // Update order status to placed
        await apiService.updateOrderStatus(orderResponse.id, 'placed');
        
        clearCart();
        setOrderPlaced(true);
        
        toast({
          title: "Order Placed Successfully",
          description: "Your payment has been processed and your order is confirmed.",
        });
        
        navigate('/checkout/success', { state: { orderId: orderResponse.id } });
      } else {
        throw new Error(paymentResponse.error || 'Payment failed');
      }
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

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream py-12">
          <div className="container-custom max-w-3xl">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-16 h-16 mb-6 bg-olive/20 rounded-full flex items-center justify-center">
                <Check size={32} className="text-olive" />
              </div>
              <h1 className="font-playfair text-3xl text-charcoal mb-4">Order Confirmed!</h1>
              <p className="text-earth mb-6">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/"
                  className="bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-umber transition-colors"
                >
                  Continue Shopping
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
      <div className="min-h-screen bg-cream py-8">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/cart" className="flex items-center text-earth hover:text-charcoal transition-colors">
              <ChevronLeft size={20} className="mr-2" />
              Back to Cart
            </Link>
            <h1 className="font-playfair text-3xl text-charcoal">Checkout</h1>
            <div></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Cart & Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Review */}
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
              </div>

              {/* Address Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
                  <MapPin size={20} className="mr-2" />
                  Delivery Address
                </h2>
                
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id ? 'border-terracotta bg-terracotta/5' : 'border-sand hover:border-terracotta/50'
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
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
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Address */}
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
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
                  <CreditCard size={20} className="mr-2" />
                  Payment Method
                </h2>
                
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
                          <p className="font-medium text-charcoal">**** **** **** {method.card_number.slice(-4)}</p>
                          <p className="text-earth text-sm">{method.card_holder}</p>
                          <p className="text-earth text-sm">Expires: {method.expiry_date}</p>
                        </div>
                        <input
                          type="radio"
                          checked={selectedPaymentMethodId === method.id}
                          onChange={() => setSelectedPaymentMethodId(method.id)}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Payment Method */}
                  {!showAddPaymentForm ? (
                    <button
                      onClick={() => setShowAddPaymentForm(true)}
                      className="w-full p-4 border-2 border-dashed border-sand hover:border-terracotta rounded-lg text-earth hover:text-terracotta transition-colors flex items-center justify-center"
                    >
                      <Plus size={20} className="mr-2" />
                      Add New Payment Method
                    </button>
                  ) : (
                    <div className="p-4 border border-sand rounded-lg">
                      <h3 className="font-medium text-charcoal mb-4">Add New Payment Method</h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={newPaymentMethod.card_number}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, card_number: formatCardNumber(e.target.value) })}
                          className="w-full px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                        />
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={newPaymentMethod.card_holder}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, card_holder: e.target.value })}
                          className="w-full px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={newPaymentMethod.expiry_date}
                            onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiry_date: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            value={newPaymentMethod.cvv}
                            onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
                            className="px-3 py-2 border border-sand rounded-lg focus:outline-none focus:border-terracotta"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={handleAddPaymentMethod}
                          className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-umber transition-colors"
                        >
                          Save Payment Method
                        </button>
                        <button
                          onClick={() => setShowAddPaymentForm(false)}
                          className="px-4 py-2 border border-sand text-earth rounded-lg hover:border-terracotta transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || !selectedAddressId || !selectedPaymentMethodId}
                  className="w-full bg-terracotta text-white py-3 rounded-lg hover:bg-umber transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </button>
                
                <div className="mt-4 text-xs text-earth text-center">
                  <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
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
