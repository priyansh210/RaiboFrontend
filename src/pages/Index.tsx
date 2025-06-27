import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, Search, Store, Sofa, Lightbulb, Palette, Camera, Heart, Home, ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout';
import BrandSlider from '../components/BrandSlider';
import ProductCard from '../components/ProductCard';
import FeaturedBanner from '../components/FeaturedBanner';
import { brands } from '../data/products';
import { productService } from '../services/ProductService';
import { Product } from '../models/internal/Product';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import '@/styles/hide-scrollbar.css';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
    // Categories data
  const categories = [
    { 
      name: 'Furniture', 
      link: '/browse/furniture', 
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Lighting', 
      link: '/browse/lighting', 
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Decor', 
      link: '/browse/decor', 
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Art', 
      link: '/browse/art', 
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Textiles', 
      link: '/browse/textiles', 
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Kitchen', 
      link: '/browse/kitchen', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Storage', 
      link: '/browse/storage', 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=300&auto=format&fit=crop'
    },
    { 
      name: 'Outdoor', 
      link: '/browse/outdoor', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&auto=format&fit=crop'
    },
  ];
    useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await productService.fetchProducts();
        
        // Filter featured products
        const featured = products.filter(product => product.featured).slice(0, 4);
        setFeaturedProducts(featured);
        
        // Filter trending products (simulate with the newest products)
        const trending = products.filter(product => product.new).slice(0, 8);
        setTrendingProducts(trending);
        
        // Filter bestsellers
        const bestsellers = products.filter(product => product.bestSeller).slice(0, 9);
        setBestSellers(bestsellers);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Auto-scroll effect for categories (fix: use requestAnimationFrame for smoothness and always scroll)
  useEffect(() => {
    const scrollContainer = categoriesRef.current;
    if (!scrollContainer) return;

    let animationFrame: number;
    let scrollStep = 0.7; // px per frame
    let paused = false;

    const autoScroll = () => {
      if (!paused) {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += scrollStep;
        }
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    const handleMouseEnter = () => { paused = true; };
    const handleMouseLeave = () => { paused = false; };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    animationFrame = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Auto-scroll effect for trending products
  useEffect(() => {
    const scrollContainer = trendingRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 0.5;
    const scrollDelay = 50;

    const autoScroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollAmount += scrollStep;
        scrollContainer.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(autoScroll, scrollDelay);

    const handleMouseEnter = () => clearInterval(interval);
    const handleMouseLeave = () => {
      const newInterval = setInterval(autoScroll, scrollDelay);
      return () => clearInterval(newInterval);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(interval);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trendingProducts.length]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
    return (
    <Layout>
      <div className="page-transition">        {/* Categories Section - Amazon style, now as a square collage with round robin repeat and no gap */}
        <section className="py-3 border-b" style={{ backgroundColor: theme.background, borderColor: theme.border }}>
          <div className="container-custom">
            <div
              ref={categoriesRef}
              className="flex overflow-x-auto hide-scrollbar scroll-smooth"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {Array.from({ length: 16 }).map((_, i) => {
                const category = categories[i % categories.length];
                return (
                  <Link
                    key={i}
                    to={category.link}
                    className="flex-shrink-0 group"
                    style={{
                      width: 90,
                      height: 90,
                      scrollSnapAlign: 'start',
                      marginRight: i === 15 ? 0 : 0,
                    }}
                  >
                    <div className="relative w-full h-full rounded-lg overflow-hidden group-hover:shadow-lg transition-all duration-300 border border-transparent group-hover:border-opacity-50" style={{ borderColor: `${theme.primary}40` }}>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30"></div>
                      <span className="absolute bottom-1 left-1 right-1 text-xs font-semibold text-white text-center bg-black/40 rounded px-1 py-0.5 pointer-events-none" style={{letterSpacing: 0.2}}>
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8" style={{ backgroundColor: isDark ? theme.secondary : theme.cream }}>
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-playfair text-4xl md:text-6xl mb-4" style={{ color: theme.foreground }}>
                Find Your Perfect <span style={{ color: theme.primary }}>Home Goods</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: theme.mutedForeground }}>
                Discover unique, handcrafted furniture and décor from artisans around the world
              </p>
              
              <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for furniture, decor, lighting..."
                    className="w-full py-4 px-6 pl-14 text-lg border-2 focus:outline-none focus:border-opacity-70 rounded-full shadow-lg"
                    style={{
                      backgroundColor: theme.background,
                      color: theme.foreground,
                      borderColor: theme.border,
                    }}
                  />
                  <Search size={24} className="absolute left-5 top-1/2 transform -translate-y-1/2" style={{ color: theme.mutedForeground }} />
                </div>
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-full font-medium"
                  style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}
                >
                  Search
                </Button>
              </form>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <span className="text-sm" style={{ color: theme.mutedForeground }}>Popular:</span>
                {['Modern Chairs', 'Table Lamps', 'Wall Art', 'Rugs'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="text-sm px-3 py-1 rounded-full border transition-colors hover:scale-105"
                    style={{
                      color: theme.primary,
                      borderColor: theme.primary,
                      backgroundColor: 'transparent',
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="py-16" style={{ backgroundColor: theme.background }}>
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <TrendingUp size={28} className="mr-3" style={{ color: theme.primary }} />
                <h2 className="font-playfair text-3xl md:text-4xl" style={{ color: theme.foreground }}>Trending Now</h2>
              </div>
              <Link
                to="/browse/trending"
                className="hidden md:inline-flex items-center text-sm hover:underline"
                style={{ color: theme.primary }}
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.primary }}></div>
              </div>
            ) : trendingProducts.length > 0 ? (
              <div
                ref={trendingRef}
                className="flex gap-x-6 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {trendingProducts.map(product => (
                  <div
                    key={product.id}
                    className="group flex-shrink-0 relative"
                    style={{
                      width: 280,
                      height: 350,
                      scrollSnapAlign: 'start',
                    }}
                  >
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                      <div className="relative h-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="text-white text-xs px-3 py-1 uppercase tracking-wider rounded-full font-semibold" style={{ backgroundColor: theme.primary }}>
                            🔥 Trending
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                          <h3 className="text-white text-xl font-semibold mb-2">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-white text-lg font-bold">${product.price}</p>
                            <div className="flex items-center">
                              <Star size={16} className="text-yellow-400 fill-current mr-1" />
                              <span className="text-white text-sm">4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p style={{ color: theme.mutedForeground }}>No trending products available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* For You / Best Sellers - Instagram Style Collage */}
        <section className="py-16" style={{ backgroundColor: isDark ? theme.card : theme.cream }}>
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl mb-4" style={{ color: theme.foreground }}>For You</h2>
              <p className="text-lg" style={{ color: theme.mutedForeground }}>Curated picks based on what's popular</p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.primary }}></div>
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 max-w-4xl mx-auto">
                {/* Large featured item */}
                <div className="col-span-2 md:col-span-2 row-span-2">
                  <Link to={`/product/${bestSellers[0]?.id}`} className="group block relative h-full min-h-[300px] md:min-h-[400px]">
                    <div className="relative h-full rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={bestSellers[0]?.images[0]}
                        alt={bestSellers[0]?.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="text-white text-xs px-2 py-1 rounded-full font-semibold" style={{ backgroundColor: theme.primary }}>
                          #1 Best Seller
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white text-lg font-semibold mb-1">{bestSellers[0]?.name}</h3>
                        <p className="text-white/90 text-xl font-bold">${bestSellers[0]?.price}</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Smaller items */}
                {bestSellers.slice(1, 5).map((product, index) => (
                  <div key={product.id} className="aspect-square">
                    <Link to={`/product/${product.id}`} className="group block relative h-full">
                      <div className="relative h-full rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-sm font-medium truncate">{product.name}</p>
                          <p className="text-white/90 text-sm font-bold">${product.price}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                
                {/* Additional items for larger screens */}
                {bestSellers.slice(5, 9).map((product, index) => (
                  <div key={product.id} className="aspect-square hidden md:block">
                    <Link to={`/product/${product.id}`} className="group block relative h-full">
                      <div className="relative h-full rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-sm font-medium truncate">{product.name}</p>
                          <p className="text-white/90 text-sm font-bold">${product.price}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p style={{ color: theme.mutedForeground }}>No best sellers available at the moment.</p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <Link
                to="/browse/bestsellers"
                className="inline-flex items-center px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: theme.primary,
                  color: theme.primaryForeground,
                }}
              >
                Explore More <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Banner */}
        <FeaturedBanner 
          title="Handcrafted Excellence" 
          imageSrc="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop" 
          link="/browse/furniture"
        />
        
        {/* Brand Slider */}
        <section className="py-16" style={{ backgroundColor: theme.background }}>
          <div className="container-custom">
            <h2 className="font-playfair text-2xl text-center mb-8" style={{ color: theme.foreground }}>Our Partner Brands</h2>
            <BrandSlider brands={brands} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
