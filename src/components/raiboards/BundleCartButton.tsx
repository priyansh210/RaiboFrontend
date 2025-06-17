
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
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleDialog}
        size="lg"
        className="relative shadow-lg hover:shadow-xl transition-shadow"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Bundle Cart
        <Badge variant="secondary" className="ml-2 bg-white text-primary">
          {itemCount}
        </Badge>
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          ${getTotalPrice().toFixed(0)}
        </div>
      </Button>
    </div>
  );
};
