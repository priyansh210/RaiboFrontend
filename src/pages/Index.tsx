
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import BrandSlider from '../components/BrandSlider';
import ProductCard from '../components/ProductCard';
import FeaturedBanner from '../components/FeaturedBanner';
import { brands } from '../data/products';
import { fetchProducts } from '../services/ProductService';
import { Product } from '../data/products';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProducts();
        // Filter featured products from the database
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
  
  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="min-h-[70vh] bg-cream flex items-center">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight">
                Elevate your space with artisanal home goods
              </h1>
              <p className="text-earth mt-4 text-lg max-w-xl">
                Discover a curated collection of handcrafted furniture and décor that brings warmth and character to your home.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/browse/all"
                  className="bg-charcoal text-white px-8 py-3 hover:bg-umber transition-colors shadow-sm"
                >
                  Browse Collection
                </Link>
                <Link
                  to="/about"
                  className="bg-transparent text-charcoal border border-charcoal px-8 py-3 hover:bg-sand transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1587&auto=format&fit=crop"
                alt="Stylish living room"
                className="rounded-sm shadow-lg"
              />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-terracotta rounded-sm opacity-40 -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-olive rounded-sm opacity-20 -z-10"></div>
            </div>
          </div>
        </section>
        
        {/* Featured Categories */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl text-charcoal text-center mb-12">Explore Our Categories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/browse/furniture" className="category-card">
                <div className="aspect-square bg-linen relative overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop"
                    alt="Furniture"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-medium">Furniture</h3>
                      <p className="text-white/80 text-sm mt-1">45 products</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/browse/decor" className="category-card">
                <div className="aspect-square bg-linen relative overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1740&auto=format&fit=crop"
                    alt="Decor"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-xl font-medium">Decor</h3>
                      <p className="text-white/80 text-sm mt-1">31 products</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/browse/lighting" className="category-card">
                <div className="aspect-square bg-linen relative overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1587&auto=format&fit=crop"
                    alt="Lighting"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent flex items-end p-6">
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
        
        {/* Featured Products */}
        <section className="py-16 bg-cream">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h2 className="font-playfair text-3xl text-charcoal">Featured Products</h2>
              <Link 
                to="/browse/all" 
                className="group flex items-center mt-2 md:mt-0 text-terracotta"
              >
                View all products 
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="product-grid">
                {featuredProducts.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white">
                <p className="text-earth">No featured products available at the moment.</p>
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
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="font-playfair text-2xl text-charcoal text-center mb-8">Our Brands</h2>
            <BrandSlider brands={brands} />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
