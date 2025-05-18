
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Account = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
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
  
  if (!user) return null;

  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-20">
        <div className="container-custom">
          <div className="bg-white p-8 rounded-sm shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-taupe/20 p-6 rounded-sm">
                <h2 className="font-medium text-lg text-charcoal mb-3">Account Details</h2>
                <p className="text-earth mb-2">Email: {user.email}</p>
                <p className="text-earth mb-2">First Name: {user.firstName || 'Not set'}</p>
                <p className="text-earth mb-2">Last Name: {user.lastName || 'Not set'}</p>
                <button className="mt-4 text-terracotta hover:underline">Edit Details</button>
              </div>

              <div className="border border-taupe/20 p-6 rounded-sm">
                <h2 className="font-medium text-lg text-charcoal mb-3">Order History</h2>
                <p className="text-earth">You haven't placed any orders yet.</p>
                <button className="mt-4 text-terracotta hover:underline">Browse Products</button>
              </div>

              <div className="border border-taupe/20 p-6 rounded-sm">
                <h2 className="font-medium text-lg text-charcoal mb-3">Wishlist</h2>
                <p className="text-earth">Your wishlist is empty.</p>
                <button className="mt-4 text-terracotta hover:underline">Add Items</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
