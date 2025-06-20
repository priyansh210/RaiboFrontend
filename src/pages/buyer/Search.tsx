import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import SearchFilters from '../../components/search/SearchFilters';
import { productService } from '../../services/ProductService';
import { Product, ProductColor } from '../../models/internal/Product';
import { useTheme } from '../../context/ThemeContext';

const Search = () => {
  const location = useLocation();
  const { isDark, theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update image preview when imageFile changes
  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // On mount, check for navigation state from Navbar
  useEffect(() => {
    if (location.state) {
      const { searchTerm: navSearchTerm, imageFile: navImageFile, products: navProducts } = location.state as any;
      if (navSearchTerm) setSearchTerm(navSearchTerm);
      if (navImageFile) setImageFile(navImageFile);
      if (navProducts) setProducts(navProducts);
      // If products are passed, don't trigger search again
      else if (navSearchTerm || navImageFile) {
        handleSearch();
      }
    }
    // eslint-disable-next-line
  }, []);

  // Only search when user clicks search button or submits form
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      let productsData;
      if (imageFile) {
        productsData = await productService.searchProductsByTextAndImage(searchTerm, imageFile);
      } else {
        productsData = await productService.searchProducts(searchTerm);
      }
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };
const filteredProducts = products;
  // const filteredProducts = products.filter(product => {
  //   const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //                        product.company.name.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
  //   const matchesColor = selectedColors.length === 0 || 
  //                       (product.colors && selectedColors.some(selectedColor => 
  //                         product.colors!.some(productColor => productColor.code === selectedColor.code)
  //                       ));
    
  //   return matchesSearch && matchesPrice && matchesColor;
  // });

  // Handlers for file/camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  // Add an effect to prevent body scrolling when the filter panel is open on mobile
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  return (
    <Layout>
      <div className="min-h-screen bg-cream dark:bg-charcoal py-8">        <div className="container-custom relative">
          {/* Backdrop for mobile filter panel */}
          <div 
            className={`lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsFilterOpen(false)}
            aria-hidden="true"
          />{/* Search Header */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto flex flex-col gap-2">
              <form onSubmit={handleSearch} className="w-full">
                <div className="flex items-center relative">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-4 px-6 pr-32 text-lg border border-sand dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-terracotta/50 rounded-md shadow-sm bg-white dark:bg-gray-800 text-charcoal dark:text-cream"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-earth hover:text-terracotta dark:text-cream dark:hover:text-terracotta"
                    aria-label="Search"
                  >
                    <SearchIcon size={24} />
                  </button>
                  {/* Add Image Button (icon only, aesthetic design) */}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    capture={undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 border border-sand dark:border-gray-600 rounded-full p-2.5 hover:bg-sand/60 dark:hover:bg-gray-600 transition-colors shadow-sm"
                    onClick={() => fileInputRef.current?.click()}
                    title="Add Image"
                  >
                    <ImageIcon size={20} className="text-terracotta dark:text-cream" />
                  </button>
                </div>
              </form>
              {/* Image Preview with improved styling */}
              {imagePreview && (
                <div className="flex items-center gap-4 mt-3 p-3 bg-white dark:bg-gray-800 border border-sand dark:border-gray-700 rounded-md shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-sand dark:border-gray-700" />
                  <div>
                    <p className="text-sm text-earth dark:text-cream mb-1">Image selected</p>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div><div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4 flex justify-start">
              {!isFilterOpen && (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-sand dark:border-gray-700 bg-sand dark:bg-charcoal text-terracotta dark:text-cream hover:bg-sand/60 dark:hover:bg-charcoal/60 transition-colors shadow-sm"
                  onClick={() => setIsFilterOpen(true)}
                  aria-label="Show Filters"
                >
                  <Filter size={18} />
                  <span>Filters</span>
                </button>
              )}
            </div>            {/* Filters Panel */}
            <div className={`
              ${isFilterOpen 
                ? 'fixed left-0 top-0 bottom-0 w-[85%] max-w-sm z-40 flex flex-col bg-white dark:bg-charcoal p-6 overflow-y-auto transition-all duration-300 ease-in-out translate-x-0 shadow-lg' 
                : 'fixed left-0 top-0 bottom-0 w-[85%] max-w-sm z-40 flex flex-col bg-white dark:bg-charcoal p-6 overflow-y-auto transition-all duration-300 ease-in-out -translate-x-full pointer-events-none'} 
              lg:static lg:block lg:w-72 lg:min-w-72 lg:bg-transparent lg:p-0 lg:mr-6 lg:overflow-visible lg:translate-x-0 lg:pointer-events-auto lg:shadow-none
            `}>
              {/* Close button - only on mobile */}
              <div className="lg:hidden flex justify-between items-center mb-6 sticky top-0 z-10 bg-white dark:bg-charcoal pb-2 border-b border-sand dark:border-gray-700">
                <h2 className="text-xl font-semibold text-charcoal dark:text-cream">Filters</h2>
                <button
                  type="button"
                  className="rounded-full p-2 text-terracotta dark:text-cream border border-sand dark:border-gray-700 hover:bg-sand/40 dark:hover:bg-gray-700/40 transition-colors shadow-sm"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close Filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto">
                <SearchFilters
                  isOpen={isFilterOpen}
                  onToggle={() => setIsFilterOpen(!isFilterOpen)}
                  searchTerm={searchTerm}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedColors={selectedColors}
                  onColorChange={setSelectedColors}
                />
              </div>
            </div>            {/* Results */}
            <div className="flex-1">
              <div className="mb-6 border-b border-sand dark:border-gray-700 pb-4">
                <h1 className="text-2xl font-playfair text-charcoal dark:text-cream">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                </h1>
                <p className="text-earth dark:text-sand mt-1">{filteredProducts.length} products found</p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {!isLoading && filteredProducts.length === 0 && (
                <div className="text-center py-16 bg-sand/30 dark:bg-gray-800/30 rounded-lg">
                  <p className="text-earth dark:text-cream">No products found matching your criteria.</p>
                  <p className="text-sm text-earth/70 dark:text-cream/70 mt-2">Try adjusting your filters or search with different keywords.</p>
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
