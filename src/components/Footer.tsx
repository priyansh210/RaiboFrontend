
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-linen pt-16 pb-8 border-t border-taupe/10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-playfair font-medium text-charcoal mb-4">RAIBO</h3>
            <p className="text-earth text-sm mb-4">
              Curated furniture and home decor from the world's most thoughtful designers and artisans.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-earth hover:text-terracotta transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-earth hover:text-terracotta transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-earth hover:text-terracotta transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-charcoal mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse/furniture" className="text-earth hover:text-terracotta transition-colors">Furniture</Link></li>
              <li><Link to="/browse/lighting" className="text-earth hover:text-terracotta transition-colors">Lighting</Link></li>
              <li><Link to="/browse/rugs" className="text-earth hover:text-terracotta transition-colors">Rugs</Link></li>
              <li><Link to="/browse/decor" className="text-earth hover:text-terracotta transition-colors">Decor</Link></li>
              <li><Link to="/browse/kitchen" className="text-earth hover:text-terracotta transition-colors">Kitchen</Link></li>
              <li><Link to="/browse/outdoor" className="text-earth hover:text-terracotta transition-colors">Outdoor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-charcoal mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-earth hover:text-terracotta transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-earth hover:text-terracotta transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="text-earth hover:text-terracotta transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="text-earth hover:text-terracotta transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-earth hover:text-terracotta transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-earth hover:text-terracotta transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-charcoal mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="text-terracotta mt-1 mr-2 flex-shrink-0" />
                <span className="text-earth">123 Furniture Ave, Design District, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-terracotta mr-2 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-earth hover:text-terracotta transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-terracotta mr-2 flex-shrink-0" />
                <a href="mailto:hello@raibo.com" className="text-earth hover:text-terracotta transition-colors">hello@raibo.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-taupe/10 flex flex-col md:flex-row justify-between items-center text-sm text-earth">
          <p>&copy; {new Date().getFullYear()} RAIBO. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Link to="/privacy" className="hover:text-terracotta transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-terracotta transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-terracotta transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
