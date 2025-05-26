
import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/search/SearchFilters';
import { products } from '../data/products';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
    
    return matchesSearch && matchesPrice && matchesColor;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-cream py-8">
        <div className="container-custom">
          {/* Search Header */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pr-12 text-lg border border-sand focus:outline-none focus:border-terracotta/50 rounded-sm"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-earth hover:text-terracotta">
                <SearchIcon size={24} />
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            <SearchFilters
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
              searchTerm={searchTerm}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedColors={selectedColors}
              onColorChange={setSelectedColors}
            />

            {/* Results */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl font-playfair text-charcoal">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                </h1>
                <p className="text-earth mt-1">{filteredProducts.length} products found</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-earth">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
