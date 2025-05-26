
import React from 'react';
import { Filter } from 'lucide-react';
import PriceRangeSlider from '../PriceRangeSlider';
import ColorPicker from '../ColorPicker';
import CategoryFilters from './CategoryFilters';

interface SearchFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  searchTerm: string;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
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

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={onToggle}
          className="flex items-center space-x-2 bg-white border border-sand px-4 py-2 rounded-sm"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`
        md:block md:w-64 bg-white p-6 border-r border-sand
        ${isOpen ? 'block' : 'hidden'}
        md:relative absolute top-0 left-0 h-full z-10 w-80
      `}>
        <h2 className="text-lg font-semibold text-charcoal mb-6">Filters</h2>
        
        <div className="space-y-6">
          <PriceRangeSlider
            value={priceRange}
            onValueChange={onPriceChange}
            min={0}
            max={2000}
          />
          
          <div>
            <h3 className="font-medium text-charcoal mb-3">Color</h3>
            <ColorPicker
              selectedColor={selectedColors[0] || ''}
              onColorChange={(color) => onColorChange([color])}
            />
          </div>
          
          <CategoryFilters categories={categories} searchTerm={searchTerm} />
        </div>
      </div>
    </>
  );
};

export default SearchFilters;
