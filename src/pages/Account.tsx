import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, User, Package, LogOut, Save, AlertCircle, ArrowRight, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const Account = () => {
  const { user, isAuthenticated, logout, isBuyer } = useAuth();
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
      <div className="page-transition min-h-screen bg-background py-20">
        <div className="container-custom">
          <div className="bg-card p-8 rounded-sm shadow-sm border border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between md:space-x-4 mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-playfair text-2xl text-foreground">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-sm mt-1">
                    Buyer Account
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="border border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/my-orders')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">My Orders</h3>
                        <p className="text-sm text-muted-foreground">View order history and track shipments</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/my-rooms')}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Store className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-medium text-foreground">My Rooms</h3>
                        <p className="text-sm text-muted-foreground">Manage your virtual room designs</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid w-full grid-cols-1 mb-8">
                <TabsTrigger value="profile" className="text-base">Profile Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                {error && (
                  <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-sm flex items-center">
                    <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium text-lg text-foreground">Personal Information</h2>
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
                      <label className="block text-sm text-muted-foreground mb-1" htmlFor="firstName">
                        First Name
                      </label>
                      <div className="flex items-center">
                        <User size={18} className="text-muted-foreground mr-2" />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-border bg-background text-foreground focus:outline-none focus:border-primary/50 disabled:bg-muted/10 disabled:text-muted-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1" htmlFor="lastName">
                        Last Name
                      </label>
                      <div className="flex items-center">
                        <User size={18} className="text-muted-foreground mr-2" />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-border bg-background text-foreground focus:outline-none focus:border-primary/50 disabled:bg-muted/10 disabled:text-muted-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1" htmlFor="email">
                        Email
                      </label>
                      <div className="flex items-center">
                        <Mail size={18} className="text-muted-foreground mr-2" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-border bg-background text-foreground focus:outline-none focus:border-primary/50 disabled:bg-muted/10 disabled:text-muted-foreground"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1" htmlFor="phone">
                        Phone
                      </label>
                      <div className="flex items-center">
                        <Phone size={18} className="text-muted-foreground mr-2" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-border bg-background text-foreground focus:outline-none focus:border-primary/50 disabled:bg-muted/10 disabled:text-muted-foreground"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-1" htmlFor="address">
                        Address
                      </label>
                      <div className="flex items-center">
                        <MapPin size={18} className="text-muted-foreground mr-2" />
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          className="w-full py-2 px-3 border border-border bg-background text-foreground focus:outline-none focus:border-primary/50 disabled:bg-muted/10 disabled:text-muted-foreground"
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                        <Save size={16} className="ml-2" />
                      </Button>
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
