
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Product } from '../data/products';
import { fetchProducts } from '../services/ProductService';
import { Heart, TrendingUp, ArrowUp } from 'lucide-react';

const ForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const productsPerPage = 8;
  
  // Fetch initial products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await fetchProducts();
        
        // Set all products
        setProducts(productsData);
        
        // Set trending products (simulate trending with a filter)
        const trending = productsData.filter(p => p.featured || p.bestSeller).slice(0, 6);
        setTrendingProducts(trending);
        
        // Set initial display products
        setDisplayProducts(productsData.slice(0, productsPerPage));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Infinite scroll implementation
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreProducts();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);
  
  // Load more products function
  const loadMoreProducts = () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const nextPageProducts = products.slice(page * productsPerPage, (page + 1) * productsPerPage);
      
      if (nextPageProducts.length === 0) {
        setHasMore(false);
      } else {
        setDisplayProducts(prev => [...prev, ...nextPageProducts]);
        setPage(prev => prev + 1);
      }
      
      setIsLoading(false);
    }, 800);
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-8">For You</h1>
          
          {/* Trending Now Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp size={24} className="text-terracotta mr-2" />
              <h2 className="text-xl font-medium text-charcoal">Trending Now</h2>
            </div>
            
            <div className="product-grid">
              {trendingProducts.map((product) => (
                <ProductCard key={`trending-${product.id}`} product={product} />
              ))}
            </div>
          </div>
          
          {/* Personalized Recommendations */}
          <div>
            <div className="flex items-center mb-6">
              <Heart size={24} className="text-terracotta mr-2" />
              <h2 className="text-xl font-medium text-charcoal">Personalized for You</h2>
            </div>
            
            {isLoading && displayProducts.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mx-auto mb-4"></div>
                <p className="text-earth">Loading your personalized recommendations...</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-xl text-charcoal mb-2">No recommendations yet</p>
                <p className="text-earth mb-4">Browse our products to get personalized recommendations</p>
              </div>
            ) : (
              <div className="product-grid">
                {displayProducts.map((product, index) => {
                  if (displayProducts.length === index + 1) {
                    return (
                      <div ref={lastProductElementRef} key={`rec-${product.id}`}>
                        <ProductCard product={product} />
                      </div>
                    );
                  } else {
                    return <ProductCard key={`rec-${product.id}`} product={product} />;
                  }
                })}
              </div>
            )}
            
            {isLoading && displayProducts.length > 0 && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-terracotta mx-auto"></div>
                <p className="text-earth mt-2">Loading more...</p>
              </div>
            )}
            
            {!hasMore && displayProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-earth">You've reached the end of your recommendations</p>
              </div>
            )}
          </div>
          
          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 bg-terracotta text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
