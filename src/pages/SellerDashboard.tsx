
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const SellerDashboard = () => {
  const { isAuthenticated, isLoading, roles } = useAuth();
  const navigate = useNavigate();
  
  const isSeller = roles.includes('seller');
  
  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/seller/login', { replace: true });
      } else if (!isSeller) {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isSeller, isLoading, navigate]);
  
  if (isLoading || !isAuthenticated || !isSeller) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-cream">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
            <h2 className="text-xl text-charcoal">Loading dashboard...</h2>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-10">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl text-charcoal mb-8">Seller Dashboard</h1>
          
          <div className="bg-white p-6 rounded-sm shadow-sm">
            <h2 className="text-xl text-charcoal mb-4">Welcome to your seller dashboard</h2>
            <p className="text-earth mb-6">
              This is a placeholder for the seller dashboard. In a complete implementation, you would see:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-taupe/20 rounded-sm">
                <h3 className="font-medium text-charcoal">Products</h3>
                <p className="text-sm text-earth mt-2">Manage your product listings</p>
              </div>
              
              <div className="p-4 border border-taupe/20 rounded-sm">
                <h3 className="font-medium text-charcoal">Orders</h3>
                <p className="text-sm text-earth mt-2">Track and fulfill customer orders</p>
              </div>
              
              <div className="p-4 border border-taupe/20 rounded-sm">
                <h3 className="font-medium text-charcoal">Analytics</h3>
                <p className="text-sm text-earth mt-2">View sales and performance metrics</p>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-linen rounded-sm">
              <p className="text-sm text-earth">
                <strong>Note:</strong> This is a demo seller dashboard for UI demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
