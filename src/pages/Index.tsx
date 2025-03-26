
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import BrandSlider from '../components/BrandSlider';
import ProductCard from '../components/ProductCard';
import FeaturedBanner from '../components/FeaturedBanner';
import { brands } from '../data/products';
import { fetchProducts } from '../services/ProductService';
import { Product } from '../data/products';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProducts();
        // Filter featured products
        const featured = products.filter(product => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Predefined category links
  const categories = [
    { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop', slug: 'furniture' },
    { name: 'Decor', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop', slug: 'decor' },
    { name: 'Lighting', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop', slug: 'lighting' },
    { name: 'Textiles', image: 'https://images.unsplash.com/photo-1620332372374-f108c53d2e03?q=80&w=1974&auto=format&fit=crop', slug: 'textiles' },
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[80vh] bg-cream relative flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2832&auto=format&fit=crop"
            alt="Modern living room with stylish furniture" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
              Curated Home Essentials for Modern Living
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Discover thoughtfully designed furniture and decor that combines beauty with functionality.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/browse" 
                className="bg-terracotta hover:bg-umber transition-colors text-white px-8 py-3"
              >
                Shop Now
              </Link>
              <Link 
                to="/for-you" 
                className="bg-transparent border border-white hover:bg-white/10 transition-colors text-white px-8 py-3"
              >
                Personalized Recommendations
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20 bg-linen">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-playfair text-3xl text-charcoal">Featured Products</h2>
            <Link 
              to="/browse" 
              className="text-terracotta hover:text-umber transition-colors flex items-center"
            >
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mx-auto mb-4"></div>
              <p className="text-earth">Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white">
              <p className="text-earth">No featured products available at the moment.</p>
              <Link 
                to="/browse" 
                className="mt-4 inline-block text-terracotta hover:text-umber transition-colors"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Banner */}
      <FeaturedBanner />
      
      {/* Categories Section */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <h2 className="font-playfair text-3xl text-charcoal mb-10 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/browse/${category.slug}`} 
                className="group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors z-10"></div>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="text-xl font-medium text-white">{category.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Brand Partners Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-center font-playfair text-2xl text-charcoal mb-12">Our Brand Partners</h2>
          <BrandSlider brands={brands} />
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20 bg-olive text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-playfair text-3xl mb-4">Join Our Newsletter</h2>
            <p className="mb-8 text-white/80">Stay updated with the latest product arrivals, special offers and seasonal sales.</p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <button 
                type="submit"
                className="bg-cream text-olive hover:bg-linen transition-colors px-6 py-3 font-medium"
              >
                Subscribe
              </button>
            </form>
            
            <p className="mt-4 text-sm text-white/60">
              By subscribing you agree to our Privacy Policy. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
