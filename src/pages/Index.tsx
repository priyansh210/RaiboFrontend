
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import FeaturedBanner from '../components/FeaturedBanner';
import BrandSlider from '../components/BrandSlider';
import { products, brands } from '../data/products';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured);
  const bestSellers = products.filter(product => product.bestSeller);
  
  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Banner */}
        <section className="relative h-[600px] overflow-hidden bg-sand">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop" 
              alt="Modern living room with furniture" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          </div>
          
          <div className="relative container-custom h-full flex items-center">
            <div className="max-w-lg">
              <span className="inline-block mb-3 text-sm text-white/80 tracking-widest uppercase">Welcome to RAIBO</span>
              <h1 className="text-4xl md:text-6xl text-white font-playfair mb-4">
                Curated Furniture for Modern Living
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Discover pieces that inspire, crafted by the world's leading designers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/browse" 
                  className="bg-terracotta hover:bg-umber text-white py-3 px-6 inline-flex items-center transition-colors"
                >
                  <span className="font-medium">Shop Now</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link 
                  to="/for-you" 
                  className="bg-white/90 hover:bg-white text-charcoal py-3 px-6 inline-flex items-center transition-colors"
                >
                  <span className="font-medium">Personalized Picks</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Grid */}
        <section className="py-16 bg-cream">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl text-center text-charcoal mb-12">
              Browse by Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop', path: '/browse/furniture' },
                { name: 'Lighting', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070&auto=format&fit=crop', path: '/browse/lighting' },
                { name: 'Decor', image: 'https://images.unsplash.com/photo-1526057365357-80f1f70c5e95?q=80&w=1974&auto=format&fit=crop', path: '/browse/decor' },
                { name: 'Rugs', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=2070&auto=format&fit=crop', path: '/browse/rugs' },
                { name: 'Outdoor', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop', path: '/browse/outdoor' },
                { name: 'Bedding', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=2067&auto=format&fit=crop', path: '/browse/bedding-bath' },
                { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop', path: '/browse/kitchen' },
                { name: 'Shop By Room', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop', path: '/browse/rooms' },
              ].map((category, index) => (
                <Link 
                  key={index} 
                  to={category.path}
                  className="group relative h-64 overflow-hidden"
                >
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl font-medium tracking-wide">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Best Sellers */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl text-charcoal mb-2">
              Our Bestsellers
            </h2>
            <p className="text-earth mb-8">Our most popular pieces, loved by our customers.</p>
            
            <div className="product-grid">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                to="/browse" 
                className="inline-flex items-center text-terracotta hover:text-umber transition-colors"
              >
                <span className="font-medium">View All Products</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Featured Banner */}
        <FeaturedBanner 
          title="Find Your New Favorite Seat"
          subtitle="Comfortable, beautiful designs for every space."
          imageSrc="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop"
          link="/browse/sofas"
          position="right"
          ctaText="Shop Seating"
        />
        
        {/* Featured Collection */}
        <section className="py-16 bg-linen">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl text-charcoal mb-2">
              New Arrivals
            </h2>
            <p className="text-earth mb-8">The latest designs added to our collection.</p>
            
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Brand Slider */}
        <BrandSlider brands={brands} />
        
        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="font-playfair text-3xl text-center text-charcoal mb-12">
              What Our Customers Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I've ordered multiple pieces from RAIBO and the quality is consistently excellent. The customer service is also top-notch.",
                  author: "Jessica T.",
                  location: "New York, NY"
                },
                {
                  quote: "The Circle Dining Chair is even more beautiful in person than in photos. So glad I took the plunge and ordered it.",
                  author: "Michael R.",
                  location: "Chicago, IL"
                },
                {
                  quote: "Super smooth delivery and their white glove service made getting my new sofa into my apartment a breeze.",
                  author: "Sarah L.",
                  location: "Los Angeles, CA"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-linen p-6 flex flex-col">
                  <div className="flex-grow">
                    <div className="text-terracotta mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <blockquote className="text-charcoal mb-4 italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  <div>
                    <cite className="not-italic font-medium text-charcoal block">
                      {testimonial.author}
                    </cite>
                    <span className="text-sm text-earth">{testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="py-16 bg-terracotta text-white">
          <div className="container-custom text-center">
            <h2 className="font-playfair text-3xl mb-3">
              Join Our Community
            </h2>
            <p className="max-w-lg mx-auto mb-6">
              Subscribe to our newsletter for exclusive offers, design inspiration, and first access to new collections.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow py-3 px-4 text-charcoal focus:outline-none"
              />
              <button className="bg-charcoal hover:bg-black text-white py-3 px-6 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
