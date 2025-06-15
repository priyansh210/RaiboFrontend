
import React from 'react';
import { RaiBoardProduct } from '@/models/internal/RaiBoard';
import { CanvasItem } from './CanvasItem';

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
}) => {
  // Dynamic font size based on card height
  const baseHeight = 180;
  const fontScale = product.size.height / baseHeight;
  const nameFontSize = Math.max(12, Math.min(22, 14 * fontScale));
  const priceFontSize = Math.max(12, Math.min(28, 16 * fontScale));
  const padding = Math.max(6, Math.round(12 * fontScale));

  const handleDoubleClick = () => {
    onDoubleClick(product.productId);
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
        className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
        style={{ fontSize: nameFontSize }}
      >
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
          className="flex flex-col justify-between bg-white"
          style={{
            padding: `${padding}px`,
            height: `${Math.round(product.size.height * 0.4)}px`,
          }}
        >
          <h4
            className="font-medium truncate text-gray-800"
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
              className="font-semibold text-green-600"
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
