
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Product, forYouSuggestions, getProductById } from '../data/products';
import { fetchProducts } from '../services/ProductService';

const ForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<{
    id: string;
    title: string;
    products: Product[];
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        
        // Create For You suggestions using the database products
        if (productsData.length > 0) {
          const suggestionsData = [
            {
              id: 'fy1',
              title: 'Based on your browsing history',
              products: productsData.slice(0, 4),
            },
            {
              id: 'fy2',
              title: 'You might also like',
              products: productsData.slice(4, 7),
            },
            {
              id: 'fy3',
              title: 'New arrivals in your favorite styles',
              products: productsData.filter(p => p.new).slice(0, 4),
            },
          ].filter(suggestion => suggestion.products.length > 0);
          
          setSuggestions(suggestionsData);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-8">For You</h1>
          
          {isLoading ? (
            <div className="bg-white p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mx-auto mb-4"></div>
              <p className="text-earth">Loading your personalized recommendations...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="bg-white p-8 text-center">
              <p className="text-xl text-charcoal mb-2">No recommendations yet</p>
              <p className="text-earth mb-4">Browse our products to get personalized recommendations</p>
            </div>
          ) : (
            <div className="space-y-12">
              {suggestions.map((section) => (
                <div key={section.id}>
                  <h2 className="text-xl font-medium text-charcoal mb-4">{section.title}</h2>
                  <div className="product-grid">
                    {section.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
