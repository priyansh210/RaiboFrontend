
import React, { useRef, useEffect } from 'react';

interface BrandSliderProps {
  brands: {
    id: string;
    name: string;
    logo: string;
  }[];
}

const BrandSlider: React.FC<BrandSliderProps> = ({ brands }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    const animate = () => {
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += 1;
      }
      requestAnimationFrame(animate);
    };
    
    const animation = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animation);
    };
  }, []);

  return (
    <div className="bg-linen py-10 overflow-hidden">
      <div className="container-custom">
        <h2 className="font-playfair text-2xl text-charcoal text-center mb-8">Our Featured Brands</h2>
        
        <div 
          ref={sliderRef}
          className="flex items-center space-x-12 overflow-x-hidden"
          style={{ width: '200%' }}
        >
          {/* Duplicate brands for infinite scroll effect */}
          {[...brands, ...brands].map((brand, index) => (
            <div 
              key={`${brand.id}-${index}`} 
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;
