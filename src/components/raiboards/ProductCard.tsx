
import React from 'react';
import { RaiBoardProduct } from '@/models/internal/RaiBoard';
import { CanvasItem } from './CanvasItem';
import { useTempCart } from '@/context/TempCartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface ProductCardProps {
  product: RaiBoardProduct;
  isSelected: boolean;
  canEdit: boolean;
  onMove: (productId: string, position: { x: number; y: number }, zIndex?: number) => void;
  onResize: (productId: string, size: { width: number; height: number }) => void;
  onRemove: (productId: string) => void;
  onDoubleClick: (productId: string) => void;
  onSelect: (productId: string) => void;
  zoom: number;
  actualProduct?: any; // The actual product data for temp cart
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  canEdit,
  onMove,
  onResize,
  onRemove,
  onDoubleClick,
  onSelect,
  zoom,
  actualProduct,
}) => {
  const { addItem, removeItem, state: tempCartState } = useTempCart();

  // Dynamic font size based on card height
  const baseHeight = 180;
  const fontScale = product.size.height / baseHeight;
  const nameFontSize = Math.max(12, Math.min(22, 14 * fontScale));
  const priceFontSize = Math.max(12, Math.min(28, 16 * fontScale));
  const padding = Math.max(6, Math.round(12 * fontScale));

  const handleDoubleClick = () => {
    onDoubleClick(product.productId);
  };

  const isInTempCart = tempCartState.items.some(item => item.product.id === product.productId);

  const handleToggleBundle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actualProduct) {
      if (isInTempCart) {
        removeItem(product.productId);
      } else {
        addItem(actualProduct);
      }
    }
  };

  return (
    <CanvasItem
      id={product.id}
      position={product.position}
      size={product.size}
      zIndex={product.zIndex}
      isSelected={isSelected}
      canEdit={canEdit}
      onMove={onMove}
      onResize={onResize}
      onRemove={onRemove}
      onSelect={onSelect}
      onDoubleClick={handleDoubleClick}
      zoom={zoom}
      className="group"
      resizable={true}
    >
      <div
        className="w-full h-full bg-card rounded-lg shadow-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02] relative"
        style={{ fontSize: nameFontSize }}
      >
        {/* Bundle Toggle Button - Top Left */}
        {actualProduct && (
          <div className="absolute top-2 left-2 z-10">
            <Toggle
              pressed={isInTempCart}
              onPressedChange={(pressed) => {
                if (actualProduct) {
                  if (pressed) {
                    addItem(actualProduct);
                  } else {
                    removeItem(product.productId);
                  }
                }
              }}
              size="sm"
              className="w-8 h-8 p-0 bg-background/90 hover:bg-background data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-2"
            >
              {isInTempCart ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Toggle>
          </div>
        )}

        {/* In Bundle Indicator - Top Right */}
        {isInTempCart && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Product Image */}
        <div className="w-full" style={{ height: `${Math.round(product.size.height * 0.6)}px` }}>
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full h-full object-cover"
            draggable={false}
            style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          />
        </div>
        
        {/* Product Info */}
        <div
          className="flex flex-col justify-between bg-card"
          style={{
            padding: `${padding}px`,
            height: `${Math.round(product.size.height * 0.4)}px`,
          }}
        >
          <h4
            className="font-medium truncate text-card-foreground"
            style={{
              fontSize: nameFontSize,
              lineHeight: 1.2,
              marginBottom: 2,
            }}
          >
            {product.productName}
          </h4>
          <div className="flex items-center justify-between">
            <span
              className="font-semibold text-green-600 dark:text-green-400"
              style={{ fontSize: priceFontSize }}
            >
              ${product.productPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </CanvasItem>
  );
};
