import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/models/internal/Product';
import { getSimilarProducts } from '@/services/ProductService';

interface SimilarProductsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  parentProductId: string; // <-- use productId only
  onAddProduct: (product: Product) => void;
}

export const SimilarProductsDialog: React.FC<SimilarProductsDialogProps> = ({
  isOpen,
  onOpenChange,
  parentProductId,
  onAddProduct,
}) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && parentProductId) {
      setIsLoading(true);
      getSimilarProducts(parentProductId)
        .then((products) => setSimilarProducts(products))
        .catch(() => setSimilarProducts([]))
        .finally(() => setIsLoading(false));
    } else {
      setSimilarProducts([]);
    }
  }, [isOpen, parentProductId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Similar Products to Board</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></span>
              <span className="ml-3 text-muted-foreground">Loading similar products...</span>
            </div>
          ) : similarProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No similar products found.
            </p>
          ) : (
            similarProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => onAddProduct(product)}
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
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarProductsDialog;
