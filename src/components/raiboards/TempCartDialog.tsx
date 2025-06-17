import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTempCart } from '@/context/TempCartContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, X, Tag, Percent } from 'lucide-react';

export const TempCartDialog: React.FC = () => {
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    setDialogOpen,
    getTotalPrice,
    getTotalDiscount,
    getItemCount,
  } = useTempCart();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToRealCart = async () => {
    try {
      for (const item of state.items) {
        // Add each item to the real cart with the specified quantity
        for (let i = 0; i < item.quantity; i++) {
          await addToCart({
            ...item.product,
            selectedColor: { name: 'Default', code: '#000000' },
            quantity: 1
          });
        }
      }
      
      clearCart();
      setDialogOpen(false);
      
      toast({
        title: 'Success',
        description: `Added ${getItemCount()} items to your cart`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add items to cart',
        variant: 'destructive',
      });
    }
  };

  const originalTotal = state.items.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0
  );

  return (
    <Dialog open={state.isOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Bundle Cart ({getItemCount()} items)
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {state.items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No items selected</p>
              <p className="text-sm">Select products from the board to bundle them</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={item.product.displayImage || item.product.imageUrls[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-green-600">
                          ${(item.product.price * (1 - item.product.discount / 100)).toFixed(2)}
                        </span>
                        {item.product.discount > 0 && (
                          <>
                            <span className="text-xs text-muted-foreground line-through">
                              ${item.product.price.toFixed(2)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {item.product.discount}% off
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.product.id)}
                        className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Bundle Summary */}
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Bundle Summary
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original Total:</span>
                    <span>${originalTotal.toFixed(2)}</span>
                  </div>
                  
                  {getTotalDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        Total Savings:
                      </span>
                      <span>-${getTotalDiscount().toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-base">
                    <span>Bundle Total:</span>
                    <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {state.items.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <Button 
              onClick={handleAddToRealCart}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add Bundle to Cart
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="flex-1"
                size="sm"
              >
                Clear Bundle
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setDialogOpen(false)}
                className="flex-1"
                size="sm"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
