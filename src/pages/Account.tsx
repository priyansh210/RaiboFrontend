
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, User, Package, LogOut, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ordersApi } from '../api/mockApi';

// Mock user data to extend the profile
const mockOrderHistory = [
  {
    id: 'order-123',
    date: '2025-04-10',
    total: 599.97,
    status: 'delivered',
    items: [
      { id: 'item-1', name: 'Elegant Wooden Chair', price: 249.99, quantity: 1 },
      { id: 'item-2', name: 'Modern Coffee Table', price: 349.98, quantity: 1 }
    ]
  },
  {
    id: 'order-456',
    date: '2025-05-05',
    total: 1299.95,
    status: 'processing',
    items: [
      { id: 'item-3', name: 'Scandinavian Bed Frame', price: 899.99, quantity: 1 },
      { id: 'item-4', name: 'Memory Foam Mattress', price: 399.96, quantity: 1 }
    ]
  }
];

const Account = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567', // Mock data
    address: '123 Main St, Anytown, CA 94107' // Mock data
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // If not authenticated, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return '';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);
    
    return (firstInitial + lastInitial).toUpperCase();
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would be an API call to update the user profile
      toast({
        title: "Profile updated",
        description: "Your profile details have been saved.",
      });
      setIsEditing(false);
      setIsSubmitting(false);
    }, 800);
  };
  
  if (!user) return null;

  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-20">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-sm shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between md:space-x-4 mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-terracotta text-white text-xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-playfair text-2xl text-charcoal">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-earth">{user.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-terracotta text-terracotta hover:bg-terracotta/10"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>

            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="profile" className="text-base">Profile</TabsTrigger>
                <TabsTrigger value="orders" className="text-base">Order History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                {error && (
                  <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-lg text-charcoal">Personal Information</h2>
                    {!isEditing && (
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-earth mb-1" htmlFor="firstName">
                        First Name
                      </label>
                      <div className="flex items-center">
                        <User size={18} className="text-earth mr-2" />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50 disabled:bg-sand/10 disabled:text-charcoal"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-earth mb-1" htmlFor="lastName">
                        Last Name
                      </label>
                      <div className="flex items-center">
                        <User size={18} className="text-earth mr-2" />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50 disabled:bg-sand/10 disabled:text-charcoal"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-earth mb-1" htmlFor="email">
                        Email
                      </label>
                      <div className="flex items-center">
                        <Mail size={18} className="text-earth mr-2" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50 disabled:bg-sand/10 disabled:text-charcoal"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-earth mb-1" htmlFor="phone">
                        Phone
                      </label>
                      <div className="flex items-center">
                        <Phone size={18} className="text-earth mr-2" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50 disabled:bg-sand/10 disabled:text-charcoal"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm text-earth mb-1" htmlFor="address">
                        Address
                      </label>
                      <div className="flex items-center">
                        <MapPin size={18} className="text-earth mr-2" />
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50 disabled:bg-sand/10 disabled:text-charcoal"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-terracotta hover:bg-umber text-white"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                        <Save size={16} className="ml-2" />
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>
              
              <TabsContent value="orders">
                <h2 className="font-medium text-lg text-charcoal mb-4">Order History</h2>
                
                {mockOrderHistory.length === 0 ? (
                  <div className="text-center py-10 border border-taupe/20 rounded-sm">
                    <Package size={48} className="mx-auto text-earth" />
                    <p className="mt-4 text-charcoal font-medium">No orders yet</p>
                    <p className="text-earth">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mockOrderHistory.map((order) => (
                      <div key={order.id} className="border border-taupe/20 rounded-sm overflow-hidden">
                        <div className="bg-sand/20 p-4 flex flex-col sm:flex-row justify-between">
                          <div>
                            <p className="font-medium text-charcoal">Order #{order.id}</p>
                            <p className="text-sm text-earth">Placed on {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`inline-block px-2 py-1 rounded-sm text-xs uppercase font-medium ${
                              order.status === 'delivered' ? 'bg-olive/20 text-olive' : 
                              order.status === 'processing' ? 'bg-terracotta/20 text-terracotta' :
                              'bg-taupe/20 text-taupe'
                            }`}>
                              {order.status}
                            </span>
                            <p className="text-sm font-medium mt-1 text-charcoal">Total: ${order.total.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="text-sm text-earth mb-2">Items</h3>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-charcoal">
                                <p>{item.name} × {item.quantity}</p>
                                <p>${item.price.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
