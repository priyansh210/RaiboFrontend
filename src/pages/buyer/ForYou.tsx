import React, { useState, useEffect, useRef, useCallback } from 'react';
import Layout from '@/components/Layout';
import ProductInteractions from '@/components/ProductInteractions';
import { Product } from '@/models/internal/Product';
import { fetchProducts } from '@/services/ProductService';
import { Heart, TrendingUp, ArrowUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';

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
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const productsPerPage = 10;
  const isMobile = useIsMobile();
  const { theme } = useTheme();

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

  const handleShare = (productId: string) => {
    const product = displayProducts.find(p => p.id === productId);
    if (!product) return;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name} by ${product.company.name}`,
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
      if (p.id === productId && p.interactions) {
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
      <div className="min-h-screen py-4 md:py-8" style={{ backgroundColor: theme.muted }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <Heart size={isMobile ? 20 : 24} className="mr-2" style={{ color: theme.primary }} />
            <h1 className="font-playfair text-2xl md:text-4xl" style={{ color: theme.foreground }}>For You</h1>
          </div>

          {isLoading && displayProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.primary }}></div>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg mb-2" style={{ color: theme.foreground }}>No products found</p>
              <p style={{ color: theme.mutedForeground }}>Check back later for new recommendations</p>
            </div>
          ) : (
            <>
              {/* Pinterest-style masonry grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {displayProducts.map((product, index) => {
                  const isLast = displayProducts.length === index + 1;
                  const imageHeight = Math.floor(Math.random() * 200) + 200; // Random height for masonry effect

                  return (
                    <div 
                      key={product.id}
                      ref={isLast ? lastProductElementRef : null}
                      className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-4"
                      style={{ backgroundColor: theme.background }}
                    >
                      <Link to={`/product/${product.id}`} className="block">
                        <div className="relative overflow-hidden">
                          <img 
                            src={product.images?.[0] || 'https://picsum.photos/300/400'} 
                            alt={product.name}
                            className="w-full object-cover transition-transform duration-500 hover:scale-105"
                            style={{ height: `${imageHeight}px` }}
                          />
                          
                          {/* Overlay with product info */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                              <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
                              <p className="text-sm opacity-90">{product.company.name}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xl font-bold">${product.price}</span>
                                {product.discount > 0 && (
                                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                    -{product.discount}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Product interactions */}
                      <ProductInteractions
                        productId={product.id}
                        interactions={product.interactions!}
                        ratings={{ average: product.averageRating, count: product.totalRatings }}
                        onLike={handleLike}
                        onShare={handleShare}
                        showCommentPreview={true}
                      />
                    </div>
                  );
                })}
              </div>

              {isLoading && displayProducts.length > 0 && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mx-auto" style={{ borderColor: theme.primary }}></div>
                  <p className="mt-2" style={{ color: theme.mutedForeground }}>Loading more...</p>
                </div>
              )}

              {!hasMore && displayProducts.length > 0 && (
                <div className="text-center py-8">
                  <p style={{ color: theme.mutedForeground }}>You've reached the end!</p>
                </div>
              )}
            </>
          )}

          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-50 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
            style={{ backgroundColor: theme.primary }}
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
