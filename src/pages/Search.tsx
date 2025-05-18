
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Product } from '../data/products';
import { searchProducts } from '../services/ProductService';
import { Search as SearchIcon, Mic, Image, Filter, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { categories } from '../data/products';
import CategoryFilter from '../components/CategoryFilter';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load initial search results
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);
  
  // Handle search
  const handleSearch = async (query: string = searchQuery) => {
    setIsLoading(true);
    try {
      const results = await searchProducts(query);
      setProducts(results);
      setSearchParams({ q: query });
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: "Search Error",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Voice search
  const handleVoiceSearch = () => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // This is a mock implementation since actual speech recognition requires browser permissions
      setIsListening(true);
      
      // Simulate listening and then getting a result
      toast({
        title: "Listening...",
        description: "Please speak your search query.",
      });
      
      // Simulate recognition after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        const mockQuery = "modern sofa";
        setSearchQuery(mockQuery);
        handleSearch(mockQuery);
        
        toast({
          title: "Voice search completed",
          description: `Searching for "${mockQuery}"`,
        });
      }, 3000);
    } else {
      toast({
        title: "Voice search not supported",
        description: "Your browser does not support voice search. Please use text search instead.",
        variant: "destructive",
      });
    }
  };
  
  // Image search
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Simulate image processing
      setIsLoading(true);
      
      toast({
        title: "Processing image...",
        description: "Your image is being analyzed for similar products.",
      });
      
      // Simulate API call delay
      setTimeout(async () => {
        // Mock result - in reality, this would be an API call
        const mockQuery = "wooden furniture";
        setSearchQuery(mockQuery);
        const results = await searchProducts(mockQuery);
        
        setProducts(results);
        setSearchParams({ q: mockQuery });
        setIsLoading(false);
        
        toast({
          title: "Image search completed",
          description: `Found ${results.length} products matching your image.`,
        });
      }, 2000);
    }
  };
  
  // Filter handling
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category.toLowerCase())
      );
    }
    
    // Apply price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setProducts(filtered);
    setShowFilters(false);
    
    toast({
      title: "Filters applied",
      description: `Showing ${filtered.length} filtered products.`,
    });
  };
  
  // Product comparison
  const toggleProductSelection = (product: Product) => {
    setSelectedProducts(prev => 
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : prev.length < 3 ? [...prev, product] : prev
    );
  };
  
  const isProductSelected = (product: Product) => {
    return selectedProducts.some(p => p.id === product.id);
  };

  // Define filter categories for the UI - Fixed type errors by properly structuring the data
  const filterCategories = [
    {
      name: "Categories",
      options: categories.map(category => ({
        id: category.toLowerCase(),
        name: category,
        count: Math.floor(Math.random() * 20) + 5 // Random count for demo
      }))
    },
    {
      name: "Materials",
      options: [
        { id: "wood", name: "Wood", count: 24 },
        { id: "leather", name: "Leather", count: 18 },
        { id: "metal", name: "Metal", count: 12 },
        { id: "plastic", name: "Plastic", count: 8 },
        { id: "fabric", name: "Fabric", count: 15 }
      ]
    }
  ];
  
  // Handle filter changes from the CategoryFilter component
  const handleFilterChange = (group: string, selectedOptions: string[]) => {
    if (group === "Categories") {
      setSelectedCategories(selectedOptions);
    }
    // Handle other filter groups as needed
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-12">
        <div className="container-custom">
          <div className="mb-8">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for furniture, decor, brands..."
                  className="w-full py-3 px-4 pl-12 border border-taupe/30 focus:outline-none focus:border-terracotta/50 rounded-sm"
                />
                <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-earth" />
              </div>
              
              <Button 
                type="button"
                variant="outline"
                className="border-taupe/30"
                onClick={handleVoiceSearch}
                disabled={isListening}
              >
                {isListening ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic size={20} />}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className="border-taupe/30"
                onClick={handleImageUpload}
              >
                <Image size={20} />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                className={`border-taupe/30 ${showFilters ? 'bg-terracotta/10' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
              </Button>
              
              <Button type="submit" className="bg-terracotta hover:bg-umber">
                Search
              </Button>
            </form>
          </div>
          
          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white p-6 mb-8 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-lg text-charcoal">Filters</h2>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={16} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-earth mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.toLowerCase())}
                          onChange={() => toggleCategory(category.toLowerCase())}
                          className="rounded border-taupe/30 text-terracotta focus:ring-terracotta"
                        />
                        <span className="text-charcoal">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-earth mb-2">Price Range</h3>
                  <Slider 
                    defaultValue={priceRange} 
                    max={2000} 
                    step={50} 
                    onValueChange={setPriceRange} 
                  />
                  <div className="flex justify-between mt-2 text-sm text-earth">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={applyFilters}
                  className="bg-terracotta hover:bg-umber"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
          
          {/* Selected products for comparison */}
          {selectedProducts.length > 0 && (
            <div className="bg-white p-4 mb-8 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-charcoal">
                  {selectedProducts.length} {selectedProducts.length === 1 ? 'Product' : 'Products'} Selected
                </h2>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProducts([])}
                  >
                    Clear
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        className="bg-terracotta hover:bg-umber"
                      >
                        Compare
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Product Comparison</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedProducts.map(product => (
                          <div key={product.id} className="text-center">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-40 object-contain mx-auto mb-2"
                            />
                            <h3 className="font-medium text-charcoal">{product.name}</h3>
                            <p className="text-terracotta font-medium">${product.price}</p>
                            <p className="text-earth text-sm mt-2">{product.category}</p>
                            
                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                              <div className="text-earth">Material</div>
                              <div className="font-medium">{product.material}</div>
                              
                              <div className="text-earth">Dimensions</div>
                              <div className="font-medium">
                                {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D {product.dimensions.unit}
                              </div>
                              
                              <div className="text-earth">Weight</div>
                              <div className="font-medium">
                                {product.weight.value} {product.weight.unit}
                              </div>
                              
                              <div className="text-earth">Rating</div>
                              <div className="font-medium">
                                {product.ratings.average}/5 ({product.ratings.count} reviews)
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedProducts.map(product => (
                  <div key={product.id} className="flex-shrink-0 w-32">
                    <div className="relative">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                        onClick={() => toggleProductSelection(product)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-charcoal mt-1 truncate">{product.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search results */}
          <div>
            {isLoading ? (
              <div className="bg-white p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mx-auto mb-4"></div>
                <p className="text-earth">Searching for products...</p>
              </div>
            ) : searchQuery && products.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-xl text-charcoal mb-2">No products found</p>
                <p className="text-earth mb-4">Try a different search term or browse our categories</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium text-lg text-charcoal">
                    {products.length} Results {searchQuery ? `for "${searchQuery}"` : ''}
                  </h2>
                </div>
                
                <div className="product-grid">
                  {products.map(product => (
                    <div key={product.id} className="relative">
                      <ProductCard product={product} />
                      <button
                        className={`absolute top-3 right-3 p-2 rounded-full ${
                          isProductSelected(product) 
                            ? 'bg-terracotta text-white' 
                            : 'bg-white text-earth'
                        }`}
                        onClick={() => toggleProductSelection(product)}
                      >
                        {isProductSelected(product) ? (
                          <Check size={16} />
                        ) : (
                          <span className="text-sm font-medium">Compare</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : !searchQuery && (
              <div className="bg-white p-8 text-center">
                <SearchIcon size={48} className="mx-auto text-earth" />
                <p className="mt-4 text-charcoal font-medium">Start searching</p>
                <p className="text-earth">Search for items by name, brand, or category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
