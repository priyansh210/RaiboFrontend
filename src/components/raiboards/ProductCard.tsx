
import React from 'react';
import { RaiBoardProduct } from '@/models/internal/RaiBoard';
import { CanvasItem } from './CanvasItem';
import { useTempCart } from '@/context/TempCartContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';

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
  const { addItem, state: tempCartState } = useTempCart();

  // Dynamic font size based on card height
  const baseHeight = 180;
  const fontScale = product.size.height / baseHeight;
  const nameFontSize = Math.max(12, Math.min(22, 14 * fontScale));
  const priceFontSize = Math.max(12, Math.min(28, 16 * fontScale));
  const padding = Math.max(6, Math.round(12 * fontScale));

  const handleDoubleClick = () => {
    onDoubleClick(product.productId);
  };

  const handleAddToTempCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actualProduct) {
      addItem(actualProduct);
    }
  };

  const isInTempCart = tempCartState.items.some(item => item.product.id === product.productId);

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
        {/* Selection Checkbox - Top Left */}
        {actualProduct && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isInTempCart}
              onCheckedChange={(checked) => {
                if (checked) {
                  addItem(actualProduct);
                }
              }}
              className="bg-white/90 border-2"
            />
          </div>
        )}

        {/* Add to Bundle Button - Top Right */}
        {actualProduct && !isInTempCart && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddToTempCart}
              className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* In Bundle Indicator */}
        {isInTempCart && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
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
