import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CanvasItemProps {
  id: string;
  position: Position;
  size: Size;
  zIndex: number;
  isSelected: boolean;
  canEdit: boolean;
  onMove: (id: string, position: Position, zIndex?: number) => void;
  onResize?: (id: string, size: Size) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  onDoubleClick?: () => void;
  zoom: number;
  children: React.ReactNode;
  className?: string;
  resizable?: boolean;
}

export const CanvasItem: React.FC<CanvasItemProps> = ({
  id,
  position,
  size,
  zIndex,
  isSelected,
  canEdit,
  onMove,
  onResize,
  onRemove,
  onSelect,
  onDoubleClick,
  zoom,
  children,
  className = '',
  resizable = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [localPosition, setLocalPosition] = useState(position);
  const [localSize, setLocalSize] = useState(size);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const localSizeRef = useRef(size);

  // Update local state when props change
  useEffect(() => {
    setLocalPosition(position);
    setLocalSize(size);
    localSizeRef.current = size;
  }, [position, size]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit || isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - localPosition.x * zoom,
      y: e.clientY - localPosition.y * zoom,
    });
    onSelect(id);

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
      onMove(id, localPosition);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  }, [canEdit, isResizing, localPosition, id, onSelect, onMove, zoom, dragStart.x, dragStart.y]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit || !resizable || !onResize) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: localSize.width,
      height: localSize.height,
    });

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(100, resizeStart.width + deltaX / zoom);
        const newHeight = Math.max(50, resizeStart.height + deltaY / zoom);
        const newSize = { width: newWidth, height: newHeight };
        setLocalSize(newSize);
        localSizeRef.current = newSize;
      });
    };

    const handleGlobalMouseUp = () => {
      setIsResizing(false);
      onResize(id, localSizeRef.current);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  }, [canEdit, resizable, onResize, localSize, id, zoom, resizeStart.x, resizeStart.y, resizeStart.width, resizeStart.height]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id);
  }, [id, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDoubleClick) {
      onDoubleClick();
    }
  }, [onDoubleClick]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(id);
  }, [id, onRemove]);

  return (
    <div
      ref={itemRef}
      className={`absolute select-none cursor-pointer transition-all duration-150 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging || isResizing ? 'opacity-80 z-50' : ''} ${className}`}
      style={{
        left: localPosition.x,
        top: localPosition.y,
        width: localSize.width,
        height: localSize.height,
        zIndex: zIndex + (isSelected ? 1000 : 0),
        willChange: isDragging || isResizing ? 'transform' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {children}

      {/* Remove Button */}
      {isSelected && canEdit && (
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full shadow-lg"
          onClick={handleRemove}
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Resize Handle */}
      {isSelected && canEdit && resizable && onResize && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize rounded-tl-md shadow-sm hover:bg-blue-600 transition-colors"
          onMouseDown={handleResizeMouseDown}
        />
      )}

      {/* Drag Indicator */}
      {canEdit && !isDragging && !isResizing && (
        <div className="absolute top-1 left-1 w-3 h-3 bg-blue-400 rounded-full opacity-60" />
      )}
    </div>
  );
};
