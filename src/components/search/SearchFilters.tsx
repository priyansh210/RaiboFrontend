
import React, { useRef, useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import PriceRangeSlider from '../PriceRangeSlider';
import ColorPicker from '../ColorPicker';
import CategoryFilters from './CategoryFilters';
import { Color } from '@/models/internal/Color';
import { useTheme } from '../../context/ThemeContext';

interface SearchFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  searchTerm: string;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedColors: Color[];
  onColorChange: (colors: Color[]) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  isOpen,
  onToggle,
  searchTerm,
  priceRange,
  onPriceChange,
  selectedColors,
  onColorChange
}) => {
  const { isDark, theme } = useTheme();
  const filterRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    
    if (isLeftSwipe && isOpen) {
      // Close the filter panel on left swipe
      onToggle();
    }
    
    // Reset values
    setTouchStart(null);
    setTouchEnd(null);
  };
  const categories = [
    {
      name: 'Category',
      options: [
        { id: 'furniture', name: 'Furniture', count: 45 },
        { id: 'decor', name: 'Decor', count: 32 },
        { id: 'lighting', name: 'Lighting', count: 18 }
      ]
    },
    {
      name: 'Brand',
      options: [
        { id: 'west-elm', name: 'West Elm', count: 23 },
        { id: 'cb2', name: 'CB2', count: 15 },
        { id: 'pottery-barn', name: 'Pottery Barn', count: 28 }
      ]
    }
  ];

  const availableColors: Color[] = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Gray', code: '#808080' },
    { name: 'Brown', code: '#8B4513' },
    { name: 'Beige', code: '#F5F5DC' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Green', code: '#008000' },
    { name: 'Red', code: '#FF0000' }
  ];  return (
    <>
      {/* Swipeable Filter Content */}
      <div 
        ref={filterRef}
        className="space-y-6 relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Extra close button for better mobile UX */}
        <div className="lg:hidden absolute right-0 top-0 flex justify-end">
          <button
            type="button"
            className="text-terracotta dark:text-cream p-2 rounded-full hover:bg-sand/40 dark:hover:bg-gray-700/40 transition-colors"
            onClick={onToggle}
            aria-label="Close Filters"
          >
            <X size={22} />
          </button>
        </div>
        
        {/* Swipe instruction hint - only shown on mobile */}
        <div className="lg:hidden text-xs text-earth dark:text-sand/70 flex items-center mt-1 mb-3">
          <span className="inline-block mr-1">←</span> Swipe left to close filters
        </div>
        
        <h2 className="text-xl font-semibold mb-6 text-charcoal dark:text-linen">Filters</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="font-medium text-charcoal dark:text-linen mb-3">Price Range</h3>
            <PriceRangeSlider
              value={priceRange}
              onChange={onPriceChange}
              min={0}
              max={2000}
            />
          </div>
          
          <div>
            <h3 className="font-medium text-charcoal dark:text-linen mb-3">Color</h3>
            <ColorPicker
              colors={availableColors}
              selectedColor={selectedColors[0] || availableColors[0]}
              onChange={(color) => onColorChange([color])}
            />
          </div>
          
          <CategoryFilters categories={categories} searchTerm={searchTerm} />
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
