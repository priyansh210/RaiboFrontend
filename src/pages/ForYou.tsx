import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '../integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  seller_id: string;
  created_at: string;
}

const ForYou = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fix the reference to user.name by using profile information instead
  const welcomeMessage = user 
    ? `Welcome back, ${profile?.first_name || 'there'}!` 
    : 'Sign in to get personalized recommendations';
  
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a personalized recommendation algorithm
        // For now, we'll just fetch random products
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8);
          
        if (error) throw error;
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendedProducts();
  }, [user]);
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl text-charcoal mb-2">{welcomeMessage}</h1>
            <p className="text-earth">
              {isAuthenticated 
                ? 'Here are some products we think you might like based on your preferences.'
                : 'Discover products tailored to your taste when you create an account.'}
            </p>
          </div>
          
          {!isAuthenticated && (
            <div className="bg-linen p-6 mb-8 rounded-sm">
              <h2 className="font-medium text-xl text-charcoal mb-2">Create an account for personalized recommendations</h2>
              <p className="text-earth mb-4">
                Sign up to get product recommendations based on your browsing history and preferences.
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/buyer/register" 
                  className="bg-terracotta hover:bg-umber text-white px-4 py-2 transition-colors"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/buyer/login" 
                  className="border border-terracotta text-terracotta hover:bg-linen px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-playfair text-2xl text-charcoal">Recommended for You</h2>
              <Link to="/browse" className="text-terracotta hover:text-umber flex items-center gap-1 transition-colors">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white p-4 rounded-sm">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 text-center rounded-sm">
                <p className="text-earth">No recommendations available at the moment. Check back later!</p>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-playfair text-2xl text-charcoal">Based on Your Browsing History</h2>
              <Link to="/browse" className="text-terracotta hover:text-umber flex items-center gap-1 transition-colors">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white p-4 rounded-sm">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 text-center rounded-sm">
                <p className="text-earth">Browse some products to get personalized recommendations!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
