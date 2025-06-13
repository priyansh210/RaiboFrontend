
import React, { useState, useRef, useCallback } from 'react';
import { RaiBoardProduct } from '@/models/internal/RaiBoard';
import { X, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: RaiBoardProduct;
  isSelected: boolean;
  canEdit: boolean;
  onMove: (productId: string, position: { x: number; y: number }, zIndex?: number) => void;
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
  onRemove,
  onDoubleClick,
  onSelect,
  zoom,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - product.position.x * zoom,
      y: e.clientY - product.position.y * zoom,
    });
    onSelect(product.id);
  }, [canEdit, product.position, product.id, onSelect, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !canEdit) return;
    
    const newX = (e.clientX - dragStart.x) / zoom;
    const newY = (e.clientY - dragStart.y) / zoom;
    
    onMove(product.id, { x: newX, y: newY });
  }, [isDragging, canEdit, dragStart, product.id, onMove, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(product.id);
    
    // Handle double click
    setClickCount(prev => prev + 1);
    setTimeout(() => {
      if (clickCount === 1) {
        onDoubleClick(product.productId);
      }
      setClickCount(0);
    }, 300);
  }, [product.id, product.productId, onSelect, onDoubleClick, clickCount]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(product.id);
  }, [product.id, onRemove]);

  return (
    <div
      ref={cardRef}
      className={`absolute select-none cursor-pointer transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging ? 'opacity-80' : ''}`}
      style={{
        left: product.position.x,
        top: product.position.y,
        width: product.size.width,
        height: product.size.height,
        zIndex: product.zIndex + (isSelected ? 1000 : 0),
        transform: `rotate(${product.rotation}deg)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      {/* Product Card Content */}
      <div className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Product Image */}
        <div className="w-full h-3/4 bg-gray-100 overflow-hidden">
          <img
            src={product.productImage}
            alt={product.productName}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        
        {/* Product Info */}
        <div className="p-2 h-1/4 flex flex-col justify-between">
          <h4 className="font-medium text-sm text-gray-900 truncate">
            {product.productName}
          </h4>
          <p className="text-sm font-semibold text-green-600">
            ${product.productPrice.toFixed(2)}
          </p>
        </div>

        {/* Remove Button - Only show when selected and can edit */}
        {isSelected && canEdit && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {/* Drag Indicator */}
        {canEdit && (
          <div className="absolute top-1 left-1 w-2 h-2 bg-gray-400 rounded-full opacity-50" />
        )}
      </div>
    </div>
  );
};
