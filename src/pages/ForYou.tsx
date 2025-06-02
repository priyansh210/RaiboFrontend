
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Product } from '../models/internal/Product';
import { fetchProducts } from '../services/ProductService';
import { Heart, TrendingUp, ArrowUp, Share2, MessageCircle, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '../hooks/use-mobile';

// Dummy interaction data
const generateDummyInteractions = (productId: string) => ({
  likes: Math.floor(Math.random() * 500) + 10,
  shares: Math.floor(Math.random() * 100) + 5,
  comments: [
    {
      id: `${productId}-comment-1`,
      userId: 'user1',
      userName: 'Sarah Chen',
      rating: 5,
      comment: 'Absolutely love this! Quality is amazing and arrived quickly.',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      likes: Math.floor(Math.random() * 20),
      userHasLiked: false,
    },
    {
      id: `${productId}-comment-2`,
      userId: 'user2',
      userName: 'Mike Johnson',
      rating: 4,
      comment: 'Great product, exactly as described. Highly recommend!',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      likes: Math.floor(Math.random() * 15),
      userHasLiked: false,
    },
  ],
  userHasLiked: false,
  userHasShared: false,
});

const ForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const productsPerPage = 6;
  const isMobile = useIsMobile();
  
  // Fetch initial products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await fetchProducts();
        
        // Add dummy interactions to products
        const productsWithInteractions = productsData.map(product => ({
          ...product,
          interactions: generateDummyInteractions(product.id),
        }));
        
        setProducts(productsWithInteractions);
        
        // Set trending products
        const trending = productsWithInteractions.filter(p => p.featured || p.bestSeller).slice(0, 4);
        setTrendingProducts(trending);
        
        // Set initial display products
        setDisplayProducts(productsWithInteractions.slice(0, productsPerPage));
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
  
  // Handle product interactions
  const handleLike = (productId: string) => {
    setDisplayProducts(prev => prev.map(product => {
      if (product.id === productId && product.interactions) {
        const isLiked = product.interactions.userHasLiked;
        return {
          ...product,
          interactions: {
            ...product.interactions,
            likes: isLiked ? product.interactions.likes - 1 : product.interactions.likes + 1,
            userHasLiked: !isLiked,
          },
        };
      }
      return product;
    }));
    
    toast({
      title: "Product liked!",
      description: "Added to your favorites.",
    });
  };
  
  const handleShare = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} by ${product.brand}`,
        url: `/product/${product.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard.",
      });
    }
    
    setDisplayProducts(prev => prev.map(p => {
      if (p.id === product.id && p.interactions) {
        return {
          ...p,
          interactions: {
            ...p.interactions,
            shares: p.interactions.shares + 1,
            userHasShared: true,
          },
        };
      }
      return p;
    }));
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
      <div className="min-h-screen bg-cream py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <h1 className="font-playfair text-2xl md:text-4xl text-charcoal mb-6 md:mb-8 text-center md:text-left">
            For You
          </h1>
          
          {/* Trending Now Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-center md:justify-start mb-4 md:mb-6">
              <TrendingUp size={isMobile ? 20 : 24} className="text-terracotta mr-2" />
              <h2 className="text-lg md:text-xl font-medium text-charcoal">Trending Now</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {trendingProducts.map((product) => (
                <div key={`trending-${product.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <ProductCard product={product} />
                  
                  {/* Product Interactions */}
                  <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(product.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            product.interactions?.userHasLiked ? 'text-red-500' : 'hover:text-red-500'
                          }`}
                        >
                          <Heart size={16} fill={product.interactions?.userHasLiked ? 'currentColor' : 'none'} />
                          <span>{product.interactions?.likes || 0}</span>
                        </button>
                        
                        <button
                          onClick={() => handleShare(product)}
                          className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                        >
                          <Share2 size={16} />
                          <span>{product.interactions?.shares || 0}</span>
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span>{product.interactions?.comments?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span>{product.ratings.average}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Personalized Recommendations */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4 md:mb-6">
              <Heart size={isMobile ? 20 : 24} className="text-terracotta mr-2" />
              <h2 className="text-lg md:text-xl font-medium text-charcoal">Personalized for You</h2>
            </div>
            
            {isLoading && displayProducts.length === 0 ? (
              <div className="bg-white p-6 md:p-8 text-center rounded-lg">
                <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-t-2 border-b-2 border-terracotta mx-auto mb-4"></div>
                <p className="text-earth text-sm md:text-base">Loading your personalized recommendations...</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="bg-white p-6 md:p-8 text-center rounded-lg">
                <p className="text-lg md:text-xl text-charcoal mb-2">No recommendations yet</p>
                <p className="text-earth text-sm md:text-base mb-4">Browse our products to get personalized recommendations</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayProducts.map((product, index) => {
                  const isLast = displayProducts.length === index + 1;
                  
                  return (
                    <div 
                      key={`rec-${product.id}`}
                      ref={isLast ? lastProductElementRef : null}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <ProductCard product={product} />
                      
                      {/* Product Interactions */}
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLike(product.id)}
                              className={`flex items-center space-x-1 transition-colors ${
                                product.interactions?.userHasLiked ? 'text-red-500' : 'hover:text-red-500'
                              }`}
                            >
                              <Heart size={16} fill={product.interactions?.userHasLiked ? 'currentColor' : 'none'} />
                              <span>{product.interactions?.likes || 0}</span>
                            </button>
                            
                            <button
                              onClick={() => handleShare(product)}
                              className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                            >
                              <Share2 size={16} />
                              <span>{product.interactions?.shares || 0}</span>
                            </button>
                            
                            <div className="flex items-center space-x-1">
                              <MessageCircle size={16} />
                              <span>{product.interactions?.comments?.length || 0}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span>{product.ratings.average}</span>
                          </div>
                        </div>
                        
                        {/* Latest comment preview */}
                        {product.interactions?.comments && product.interactions.comments.length > 0 && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <div className="font-medium">{product.interactions.comments[0].userName}</div>
                            <div className="truncate">{product.interactions.comments[0].comment}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {isLoading && displayProducts.length > 0 && (
              <div className="text-center py-6 md:py-8">
                <div className="animate-spin rounded-full h-6 md:h-8 w-6 md:w-8 border-t-2 border-b-2 border-terracotta mx-auto"></div>
                <p className="text-earth mt-2 text-sm md:text-base">Loading more...</p>
              </div>
            )}
            
            {!hasMore && displayProducts.length > 0 && (
              <div className="text-center py-6 md:py-8">
                <p className="text-earth text-sm md:text-base">You've reached the end of your recommendations</p>
              </div>
            )}
          </div>
          
          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 bg-terracotta text-white rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-50 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            aria-label="Scroll to top"
          >
            <ArrowUp size={isMobile ? 16 : 20} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
