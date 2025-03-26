
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Product } from '../data/products';
import { supabase } from '../integrations/supabase/client';

const ForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products from Supabase
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .limit(16);
          
        if (productError) throw productError;
        
        // For each product, fetch its images and colors
        if (productData) {
          const productsWithDetails = await Promise.all(
            productData.map(async (product) => {
              // Fetch images
              const { data: imageData } = await supabase
                .from('product_images')
                .select('image_url')
                .eq('product_id', product.id);
                
              // Fetch colors
              const { data: colorData } = await supabase
                .from('product_colors')
                .select('name, code')
                .eq('product_id', product.id);
                
              // Transform to match Product type
              return {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                brand: product.brand,
                category: product.category,
                subcategory: '', // Default value
                images: imageData?.map(img => img.image_url) || ['/placeholder.svg'],
                colors: colorData || [{ name: 'Default', code: '#000000' }],
                sizes: [], // Default value
                material: product.materials || '',
                weight: '', // Default value
                dimensions: product.dimensions || '',
                features: [], // Default value
                rating: 0, // Default value
                reviewCount: 0, // Default value
                stock: product.stock,
                deliveryInfo: product.delivery_info || 'Standard shipping: 3-5 business days',
                isFeatured: product.is_featured || false,
              };
            })
          );
          
          setProducts(productsWithDetails);
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleExploreClick = () => {
    navigate('/browse');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream py-12">
          <div className="container-custom">
            <h1 className="font-playfair text-3xl text-center text-charcoal mb-8">Loading personalized recommendations...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream py-12">
          <div className="container-custom">
            <h1 className="font-playfair text-3xl text-center text-charcoal mb-8">Oops! Something went wrong</h1>
            <p className="text-center text-earth mb-8">{error}</p>
            <div className="flex justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-terracotta hover:bg-umber text-white py-2 px-6 rounded-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-12">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl text-center text-charcoal mb-8">Recommended For You</h1>
          
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-earth mb-6">We don't have any personalized recommendations yet.</p>
              <p className="text-earth mb-8">Browse our catalog to help us understand your style preferences.</p>
              <button 
                onClick={handleExploreClick}
                className="bg-terracotta hover:bg-umber text-white py-2 px-6 rounded-sm transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleExploreClick}
                  className="bg-terracotta hover:bg-umber text-white py-2 px-6 rounded-sm transition-colors"
                >
                  Show More Products
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
