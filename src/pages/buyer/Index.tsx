import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Star, Search, Store } from 'lucide-react';
import Layout from '../../components/Layout';
import BrandSlider from '../../components/BrandSlider';
import ProductCard from '../../components/ProductCard';
import FeaturedBanner from '../../components/FeaturedBanner';
import { brands } from '../../data/products';
import { productService } from '../../services/ProductService';
import { Product } from '../../models/internal/Product';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, isDark } = useTheme();
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await productService.fetchProducts();
        
        // Filter featured products
        const featured = products.filter(product => product.featured).slice(0, 4);
        setFeaturedProducts(featured);
        
        // Filter trending products (simulate with the newest products)
        const trending = products.filter(product => product.new).slice(0, 6);
        setTrendingProducts(trending);
        
        // Filter bestsellers
        const bestsellers = products.filter(product => product.bestSeller).slice(0, 4);
        setBestSellers(bestsellers);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className={`min-h-[70vh] flex items-center`} style={{ backgroundColor: isDark ? theme.secondary : theme.cream }}>
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
            <div>
              <div className="mb-6">
                <h1 className="font-playfair text-5xl md:text-7xl leading-tight mb-4" style={{ color: theme.foreground }}>
                  RAIBO
                </h1>
              </div>
              
              <h2 className="font-playfair text-3xl md:text-4xl leading-tight mb-4" style={{ color: theme.foreground }}>
                Discover artisanal home goods
              </h2>
              <p className="mt-4 text-lg max-w-xl" style={{ color: theme.mutedForeground }}>
                Find curated collections of handcrafted furniture and décor that brings warmth and character to your home.
              </p>
              
              <form onSubmit={handleSearch} className="mt-8 flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for furniture, decor..."
                    className="w-full py-3 px-4 pl-12 border focus:outline-none focus:border-opacity-50 rounded-sm"
                    style={{
                      backgroundColor: theme.background,
                      color: theme.foreground,
                      borderColor: `${theme.border}50`,
                    }}
                  />
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: theme.mutedForeground }} />
                </div>
                <Button type="submit" className="ml-2" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>
                  Search
                </Button>
              </form>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/browse/all"
                  className="px-8 py-3 transition-colors shadow-sm inline-block"
                  style={{
                    backgroundColor: theme.foreground,
                    color: theme.background,
                  }}
                >
                  Browse Collection
                </Link>
                <Link
                  to="/for-you"
                  className="bg-transparent px-8 py-3 border transition-colors inline-block"
                  style={{
                    color: theme.foreground,
                    borderColor: theme.border,
                  }}
                >
                  For You
                </Link>
              </div>
              
              {/* Seller Portal Link */}
              <div className="mt-6 p-4 rounded-sm border" style={{ backgroundColor: `${theme.background}80`, borderColor: `${theme.border}30` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Store size={20} style={{ color: theme.primary }} />
                  <span className="font-medium" style={{ color: theme.foreground }}>Are you a seller?</span>
                </div>
                <p className="text-sm mb-3" style={{ color: theme.mutedForeground }}>
                  Join our marketplace and start selling your artisanal products.
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/seller/login"
                    className="hover:underline text-sm font-medium"
                    style={{ color: theme.primary }}
                  >
                    Seller Login
                  </Link>
                  <span className="text-sm" style={{ color: theme.mutedForeground }}>•</span>
                  <Link
                    to="/seller/register"
                    className="hover:underline text-sm font-medium"
                    style={{ color: theme.primary }}
                  >
                    Become a Seller
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1587&auto=format&fit=crop"
                alt="Stylish living room"
                className="rounded-sm shadow-lg"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-sm opacity-40 -z-10" style={{ backgroundColor: theme.primary }}></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-sm opacity-20 -z-10" style={{ backgroundColor: theme.accent }}></div>
            </div>
          </div>
        </section>
        
        {/* Trending Now Section */}
        <section className="py-16" style={{ backgroundColor: theme.background }}>
          <div className="container-custom">
            <div className="flex items-center mb-8">
              <TrendingUp size={24} className="mr-2" style={{ color: theme.primary }} />
              <h2 className="font-playfair text-3xl" style={{ color: theme.foreground }}>Trending Now</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.primary }}></div>
              </div>
            ) : trendingProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {trendingProducts.map(product => (
                  <div key={product.id} className="group overflow-hidden">
                    <Link to={`/product/${product.id}`} className="block relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="text-white text-xs px-2 py-1 uppercase tracking-wider" style={{ backgroundColor: theme.primary }}>
                          Trending
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-medium">{product.name}</h3>
                        <p className="text-white/80 text-sm">${product.price}</p>
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
            
            <div className="text-center mt-8">
              <Link
                to="/browse/all"
                className="inline-flex items-center hover:underline"
                style={{ color: theme.primary }}
              >
                View All Trending Items
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Categories */}
        <section className="py-16" style={{ backgroundColor: isDark ? theme.card : theme.cream }}>
          <div className="container-custom">
            <h2 className="font-playfair text-3xl text-center mb-12" style={{ color: theme.foreground }}>Explore Our Categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/browse/furniture" className="category-card group">
                <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: theme.muted }}>
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop"
                    alt="Furniture"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-medium">Furniture</h3>
                      <p className="text-white/80 text-sm mt-1">45 products</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/browse/decor" className="category-card group">
                <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: theme.muted }}>
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1740&auto=format&fit=crop"
                    alt="Decor"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-medium">Decor</h3>
                      <p className="text-white/80 text-sm mt-1">31 products</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/browse/lighting" className="category-card group">
                <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: theme.muted }}>
                  <img
                    src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1587&auto=format&fit=crop"
                    alt="Lighting"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-medium">Lighting</h3>
                      <p className="text-white/80 text-sm mt-1">18 products</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Best Sellers Section */}
        <section className="py-16" style={{ backgroundColor: theme.background }}>
          <div className="container-custom">
            <div className="flex items-center mb-8">
              <Star size={24} className="mr-2" style={{ color: theme.primary }} />
              <h2 className="font-playfair text-3xl" style={{ color: theme.foreground }}>Best Sellers</h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.primary }}></div>
              </div>
            ) : bestSellers.length > 0 ? (
              <div className="product-grid">
                {bestSellers.map(product => (
                  <ProductCard key={product.id} product={product} badge="Best Seller" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p style={{ color: theme.mutedForeground }}>No bestsellers available at the moment.</p>
              </div>
            )}
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
            <h2 className="font-playfair text-2xl text-center mb-8" style={{ color: theme.foreground }}>Our Brands</h2>
            <BrandSlider brands={brands} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
