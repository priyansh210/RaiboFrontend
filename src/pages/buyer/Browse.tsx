import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import CategoryFilter from '../../components/CategoryFilter';
import PriceRangeSlider from '../../components/PriceRangeSlider';
import { categories } from '../../data/products';
import { fetchProducts, searchProducts } from '../../services/ProductService';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../../models/internal/Product';

const Browse = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Fetch products from database
  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      
      try {
        const query = searchParams.get('q');
        let productsData;
        
        if (query) {
          // Use search function if there's a query
          productsData = await fetchProducts();
        } else {
          // Otherwise fetch all products
          productsData = await fetchProducts();
        }
        
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getProducts();
  }, [searchParams]);
  
  // Filtering products based on category parameter, search query, and active filters
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    
    // Filter by URL category parameter
    if (category && category !== 'all') {
      result = result.filter(product => 
        product.category.name.toLowerCase().includes(category.toLowerCase()) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(category.toLowerCase()))
      );
    }
    
    // Apply active filters
    Object.entries(activeFilters).forEach(([group, selectedOptions]) => {
      if (selectedOptions.length === 0) return;
      
      switch (group) {
        case 'Category':
          if (selectedOptions.length > 0) {
            result = result.filter(product => 
              selectedOptions.some(option => 
                product.category.name.toLowerCase().includes(option) ||
                (product.subcategory && product.subcategory.toLowerCase().includes(option))
              )
            );
          }
          break;
        case 'Brand':
          if (selectedOptions.length > 0) {
            result = result.filter(product => 
              selectedOptions.some(option => 
                (product.brand && product.brand.toLowerCase().includes(option)) ||
                product.company.name.toLowerCase().includes(option)
              )
            );
          }
          break;
        case 'Price':
          if (selectedOptions.includes('under-500')) {
            result = result.filter(product => product.price < 500);
          } else if (selectedOptions.includes('500-1000')) {
            result = result.filter(product => product.price >= 500 && product.price <= 1000);
          } else if (selectedOptions.includes('1000-2000')) {
            result = result.filter(product => product.price > 1000 && product.price <= 2000);
          } else if (selectedOptions.includes('over-2000')) {
            result = result.filter(product => product.price > 2000);
          }
          break;
        case 'Color':
          if (selectedOptions.length > 0) {
            result = result.filter(product => 
              product.colors && product.colors.some(color => 
                selectedOptions.some(option => 
                  color.name.toLowerCase().includes(option)
                )
              )
            );
          }
          break;
      }
    });
    
    // Apply price range filter
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
  }, [category, searchParams, activeFilters, priceRange, products]);
  
  const handleFilterChange = (group: string, selectedOptions: string[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [group]: selectedOptions,
    }));
  };
  
  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl text-charcoal">
              {category 
                ? `${category.charAt(0).toUpperCase()}${category.slice(1)} Collection`
                : 'All Products'
              }
            </h1>
            
            {searchParams.get('q') && (
              <p className="text-earth mt-2">
                Search results for "{searchParams.get('q')}"
              </p>
            )}
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <button
              onClick={toggleFilterPanel}
              className="flex items-center space-x-2 bg-white py-2 px-4 shadow-sm hover:bg-linen transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'text-terracotta' : 'text-earth'}`}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 ${view === 'list' ? 'text-terracotta' : 'text-earth'}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filter Sidebar - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <CategoryFilter 
                  filters={categories} 
                  onFilterChange={handleFilterChange} 
                />
                
                <div className="mt-6 bg-white p-6 rounded-sm">
                  <h3 className="font-medium text-charcoal mb-4">Price Range</h3>
                  <PriceRangeSlider 
                    min={0} 
                    max={5000} 
                    step={100} 
                    value={priceRange} 
                    onChange={setPriceRange} 
                  />
                </div>
              </div>
            </aside>
            
            {/* Mobile Filter Panel */}
            <div className={`
              fixed inset-0 bg-white z-40 transition-transform duration-300 md:hidden overflow-auto
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Filters</h3>
                  <button 
                    onClick={toggleFilterPanel}
                    className="p-1"
                    aria-label="Close filter panel"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <CategoryFilter 
                  filters={categories} 
                  onFilterChange={handleFilterChange} 
                />
                
                <div className="mt-6">
                  <h3 className="font-medium text-charcoal mb-4">Price Range</h3>
                  <PriceRangeSlider 
                    min={0} 
                    max={5000} 
                    step={100} 
                    value={priceRange} 
                    onChange={setPriceRange} 
                  />
                </div>
              </div>
              
              <div className="p-4 border-t">
                <button
                  onClick={toggleFilterPanel}
                  className="w-full py-3 bg-terracotta text-white"
                >
                  View Results ({filteredProducts.length})
                </button>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              {/* Results Info and View Toggle - Desktop */}
              <div className="hidden md:flex justify-between items-center mb-6">
                <p className="text-earth">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <SlidersHorizontal size={16} className="text-earth" />
                    <span className="text-earth">Sort by:</span>
                    <select className="bg-white border border-taupe/20 py-1 px-2 text-sm">
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Most Popular</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setView('grid')}
                      className={`p-2 ${view === 'grid' ? 'text-terracotta' : 'text-earth'}`}
                      aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={`p-2 ${view === 'list' ? 'text-terracotta' : 'text-earth'}`}
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Loading State */}
              {isLoading ? (
                <div className="bg-white p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mx-auto mb-4"></div>
                  <p className="text-earth">Loading products...</p>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  {filteredProducts.length > 0 ? (
                    <div className={view === 'grid' ? 'product-grid' : 'space-y-4'}>
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 text-center">
                      <p className="text-lg text-earth mb-2">No products found</p>
                      <p className="text-sm text-earth/70">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Browse;
