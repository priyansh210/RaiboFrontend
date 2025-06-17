
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTempCart } from '@/context/TempCartContext';
import { ShoppingCart } from 'lucide-react';

export const BundleCartButton: React.FC = () => {
  const { getItemCount, toggleDialog, getTotalPrice } = useTempCart();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 md:bottom-6 md:left-6">
      <Button
        onClick={toggleDialog}
        size="lg"
        className="relative shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        <span className="hidden sm:inline">Bundle Cart</span>
        <span className="sm:hidden">Bundle</span>
        <Badge variant="secondary" className="ml-2 bg-background text-foreground">
          {itemCount}
        </Badge>
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-medium">
          ${getTotalPrice().toFixed(0)}
        </div>
      </Button>
    </div>
  );
};
