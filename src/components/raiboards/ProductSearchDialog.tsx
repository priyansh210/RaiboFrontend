import React, { useState, useEffect } from 'react';
import { Product } from '@/models/internal/Product';
import { searchProducts } from '@/services/ProductService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';

interface ProductSearchDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddProduct: (product: Product) => void;
}

export const ProductSearchDialog: React.FC<ProductSearchDialogProps> = ({
  isOpen,
  onOpenChange,
  onAddProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchProducts(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search products:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isOpen) {
        handleSearch(searchTerm);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, isOpen]);

  const handleAddProduct = (product: Product) => {
    onAddProduct(product);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Products to Board</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></span>
                <span className="ml-3 text-muted-foreground">Searching...</span>
              </div>
            ) : (
              <>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                    onClick={() => handleAddProduct(product)}
                  >
                    <img
                      src={product.displayImage || product.imageUrls[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                    <Button size="sm">Add</Button>
                  </div>
                ))}
                {searchTerm && searchResults.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No products found for "{searchTerm}"
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};