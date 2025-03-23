
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeaturedBannerProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  link: string;
  position?: 'left' | 'right';
  ctaText?: string;
  theme?: 'light' | 'dark';
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  title,
  subtitle,
  imageSrc,
  link,
  position = 'right',
  ctaText = 'Shop Now',
  theme = 'light',
}) => {
  return (
    <div className="relative overflow-hidden bg-sand rounded-sm h-[500px] animate-fade-in">
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${
          position === 'left'
            ? 'from-black/50 via-black/30 to-transparent'
            : 'from-transparent via-black/30 to-black/50'
        }`}/>
      </div>
      
      <div className={`relative h-full container-custom flex ${
        position === 'left' ? 'justify-start' : 'justify-end'
      } items-center`}>
        <div className={`max-w-md p-8 ${
          position === 'left'
            ? 'text-left'
            : 'text-right'
        }`}>
          <h2 className={`font-playfair text-4xl md:text-5xl font-medium mb-3 ${
            theme === 'light' ? 'text-white' : 'text-charcoal'
          }`}>
            {title}
          </h2>
          
          {subtitle && (
            <p className={`text-lg mb-6 ${
              theme === 'light' ? 'text-white/90' : 'text-charcoal/90'
            }`}>
              {subtitle}
            </p>
          )}
          
          <Link
            to={link}
            className={`inline-flex items-center ${
              position === 'left' ? 'flex-row' : 'flex-row-reverse'
            } space-x-2 ${
              theme === 'light'
                ? 'bg-white/90 hover:bg-white text-terracotta'
                : 'bg-terracotta hover:bg-umber text-white'
            } py-3 px-6 transition-colors`}
          >
            <span className="font-medium">{ctaText}</span>
            {position === 'left' ? (
              <ArrowRight size={18} className="ml-2" />
            ) : (
              <ArrowRight size={18} className="mr-2" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
