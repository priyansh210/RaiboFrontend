import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RaiBoardProduct } from '@/models/internal/RaiBoard';
import { X } from 'lucide-react';
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
  const [localPosition, setLocalPosition] = useState(product.position);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Dynamic font size based on card height (min 12px, max 28px)
  const baseHeight = 180; // base design height
  const fontScale = product.size.height / baseHeight;
  const nameFontSize = Math.max(12, Math.min(22, 14 * fontScale));
  const priceFontSize = Math.max(12, Math.min(28, 16 * fontScale));
  const categoryFontSize = Math.max(10, Math.min(18, 12 * fontScale));
  const padding = Math.max(6, Math.round(12 * fontScale));

  // Update local position when product position changes
  useEffect(() => {
    setLocalPosition(product.position);
  }, [product.position]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - localPosition.x * zoom,
      y: e.clientY - localPosition.y * zoom,
    });
    onSelect(product.id);

    // Add global mouse event listeners for smoother dragging
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const newX = (e.clientX - dragStart.x) / zoom;
        const newY = (e.clientY - dragStart.y) / zoom;
        setLocalPosition({ x: newX, y: newY });
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      onMove(product.id, localPosition);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  }, [canEdit, localPosition, product.id, onSelect, onMove, zoom, dragStart.x, dragStart.y]);

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
      } ${isDragging ? 'opacity-80 z-50' : ''}`}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        width: product.size.width,
        height: product.size.height,
        zIndex: product.zIndex + (isSelected ? 1000 : 0),
        transform: `rotate(${product.rotation}deg)`,
        willChange: isDragging ? 'transform' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* Product Card Content */}
      <div
        className="w-full h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow relative flex flex-col"
        style={{ fontSize: nameFontSize }}
      >
        {/* Product Image */}
        <div className="w-full" style={{ height: `${Math.round(product.size.height * 0.6)}px`, background: "#f3f4f6" }}>
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
          className="flex flex-col justify-between"
          style={{
            padding: `${padding}px`,
            height: `${Math.round(product.size.height * 0.4)}px`,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(2px)",
          }}
        >
          <h4
            className="font-medium truncate"
            style={{
              fontSize: nameFontSize,
              lineHeight: 1.2,
              marginBottom: 2,
              color: "#22223b",
            }}
          >
            {product.productName}
          </h4>
          <div className="flex items-center justify-between">
            <span
              className="font-semibold"
              style={{
                fontSize: priceFontSize,
                color: "#16a34a",
              }}
            >
              ${product.productPrice.toFixed(2)}
            </span>
            <span
              className="text-gray-400"
              style={{
                fontSize: categoryFontSize,
                marginLeft: 8,
              }}
            >
              {"Product Category"} {/* Replace with actual category if available */}
            </span>
          </div>
        </div>

        {/* Remove Button - Only show when selected and can edit */}
        {isSelected && canEdit && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
            onClick={handleRemove}
            style={{ fontSize: Math.max(10, nameFontSize * 0.8) }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}

        {/* Drag Indicator */}
        {canEdit && (
          <div
            className="absolute top-1 left-1 rounded-full opacity-50"
            style={{
              width: Math.max(8, Math.round(12 * fontScale)),
              height: Math.max(8, Math.round(12 * fontScale)),
              background: "#60a5fa",
            }}
          />
        )}
      </div>
    </div>
  );
};