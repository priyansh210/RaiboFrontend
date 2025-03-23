
import React from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import FeaturedBanner from '../components/FeaturedBanner';
import { products, forYouSuggestions, getProductById } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const ForYou = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-2">
              {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}!` : 'Personalized Picks'}
            </h1>
            <p className="text-earth">
              {isAuthenticated 
                ? 'Curated recommendations based on your preferences and browsing history.' 
                : 'Create an account to get personalized recommendations tailored to your taste.'}
            </p>
          </div>
          
          {!isAuthenticated && (
            <div className="bg-white p-6 rounded-sm mb-10 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="font-medium text-xl text-charcoal mb-2">
                    Sign in for personalized recommendations
                  </h2>
                  <p className="text-earth">
                    Create an account to get custom recommendations based on your style preferences.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Link 
                    to="/login" 
                    className="inline-block bg-sand hover:bg-taupe text-charcoal hover:text-white py-2 px-4 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="inline-block bg-terracotta hover:bg-umber text-white py-2 px-4 transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Feature Banner */}
          <FeaturedBanner 
            title="Tailored to Your Taste"
            subtitle="Discover pieces that complement your style and existing furniture."
            imageSrc="https://images.unsplash.com/photo-1649943043780-5e616f6d87e8?q=80&w=2070&auto=format&fit=crop"
            link="/browse"
            position="left"
            ctaText="Explore All"
          />
          
          {/* Recommendation Sections */}
          <div className="mt-16 space-y-16">
            {forYouSuggestions.map((section) => (
              <div key={section.id}>
                <div className="flex items-center mb-6">
                  <Sparkles size={20} className="text-terracotta mr-2" />
                  <h2 className="font-playfair text-2xl text-charcoal">{section.title}</h2>
                </div>
                
                <div className="product-grid">
                  {section.products.map(productId => {
                    const product = getProductById(productId);
                    return product ? <ProductCard key={product.id} product={product} /> : null;
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Recently Viewed */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-2xl text-charcoal">Recently Viewed</h2>
              <Link 
                to="/browse" 
                className="text-terracotta hover:text-umber transition-colors flex items-center"
              >
                <span>View All</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="product-grid">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          
          {/* Style Quiz CTA */}
          <div className="mt-16 bg-linen p-8 rounded-sm animate-fade-in">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="font-playfair text-2xl text-charcoal mb-2">
                  Not seeing what you love?
                </h2>
                <p className="text-earth mb-4">
                  Take our quick style quiz to help us understand your preferences better. 
                  We'll use your answers to curate recommendations that match your unique style.
                </p>
                <button className="bg-terracotta hover:bg-umber text-white py-2 px-6 transition-colors">
                  Take Style Quiz
                </button>
              </div>
              <div className="md:w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=2080&auto=format&fit=crop" 
                  alt="Stylish living room with modern furniture" 
                  className="w-full h-auto rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
