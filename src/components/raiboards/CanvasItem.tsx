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
  const [touchInteracting, setTouchInteracting] = useState(false);

  const itemRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const localPositionRef = useRef(position);
  const localSizeRef = useRef(size);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Update local state and refs when props change, but not during interaction
  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(position);
      localPositionRef.current = position;
    }
  }, [position, isDragging]);

  useEffect(() => {
    if (!isResizing) {
      setLocalSize(size);
      localSizeRef.current = size;
    }
  }, [size, isResizing]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit || isResizing) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - localPositionRef.current.x * zoom,
      y: e.clientY - localPositionRef.current.y * zoom,
    };
    onSelect(id);

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const newX = (e.clientX - dragStartRef.current.x) / zoom;
        const newY = (e.clientY - dragStartRef.current.y) / zoom;
        localPositionRef.current = { x: newX, y: newY };
        if (itemRef.current) {
          itemRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      });
    };

    const handleGlobalMouseUp = () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      setIsDragging(false);
      onMove(id, localPositionRef.current);
      setLocalPosition(localPositionRef.current);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  }, [canEdit, isResizing, id, onSelect, onMove, zoom]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (!canEdit || !resizable || !onResize) return;

    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: localSizeRef.current.width,
      height: localSizeRef.current.height,
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;
        const newWidth = Math.max(100, resizeStartRef.current.width + deltaX / zoom);
        const newHeight = Math.max(50, resizeStartRef.current.height + deltaY / zoom);
        localSizeRef.current = { width: newWidth, height: newHeight };
        if (itemRef.current) {
          itemRef.current.style.width = `${newWidth}px`;
          itemRef.current.style.height = `${newHeight}px`;
        }
      });
    };

    const handleGlobalMouseUp = () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      setIsResizing(false);
      onResize(id, localSizeRef.current);
      setLocalSize(localSizeRef.current);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  }, [canEdit, resizable, onResize, id, zoom]);
  // Touch event handlers for mobile devices
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!canEdit || isResizing) return;

    e.stopPropagation();

    // Tell the canvas we're interacting with an element
    setTouchInteracting(true);
    setIsDragging(true);
    onSelect(id);

    const touch = e.touches[0];
    dragStartRef.current = {
      x: touch.clientX - localPositionRef.current.x * zoom,
      y: touch.clientY - localPositionRef.current.y * zoom,
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const touch = e.touches[0];
        const newX = (touch.clientX - dragStartRef.current.x) / zoom;
        const newY = (touch.clientY - dragStartRef.current.y) / zoom;
        localPositionRef.current = { x: newX, y: newY };
        if (itemRef.current) {
          itemRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        }
      });
    };

    const handleGlobalTouchEnd = () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchEnd);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      setIsDragging(false);
      setTouchInteracting(false);
      onMove(id, localPositionRef.current);
      setLocalPosition(localPositionRef.current);
    };

    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);
    document.addEventListener('touchcancel', handleGlobalTouchEnd);
  }, [canEdit, isResizing, id, onSelect, onMove, zoom]);

  // Touch handler for resize
  const handleResizeTouchStart = useCallback((e: React.TouchEvent) => {
    if (!canEdit || !resizable || !onResize) return;

    e.preventDefault();
    e.stopPropagation();

    setTouchInteracting(true);
    setIsResizing(true);

    const touch = e.touches[0];
    resizeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      width: localSizeRef.current.width,
      height: localSizeRef.current.height,
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const touch = e.touches[0];
        const deltaX = touch.clientX - resizeStartRef.current.x;
        const deltaY = touch.clientY - resizeStartRef.current.y;
        const newWidth = Math.max(100, resizeStartRef.current.width + deltaX / zoom);
        const newHeight = Math.max(50, resizeStartRef.current.height + deltaY / zoom);
        localSizeRef.current = { width: newWidth, height: newHeight };
        if (itemRef.current) {
          itemRef.current.style.width = `${newWidth}px`;
          itemRef.current.style.height = `${newHeight}px`;
        }
      });
    };

    const handleGlobalTouchEnd = () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchEnd);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      setIsResizing(false);
      setTouchInteracting(false);
      onResize(id, localSizeRef.current);
      setLocalSize(localSizeRef.current);
    };

    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd);
    document.addEventListener('touchcancel', handleGlobalTouchEnd);
  }, [canEdit, resizable, onResize, id, zoom]);
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
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      } ${isDragging || isResizing ? 'opacity-80 z-50' : ''} ${className}`}
      style={{
        transform: `translate(${localPosition.x}px, ${localPosition.y}px)`,
        width: localSize.width,
        height: localSize.height,
        zIndex: zIndex + (isSelected ? 1000 : 0),
        willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
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
          className="absolute bottom-0 right-0 w-5 h-5 bg-primary cursor-se-resize rounded-tl-md shadow-sm hover:bg-primary/90 transition-colors"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleResizeTouchStart}
        />
      )}

      {/* Drag Indicator */}
      {canEdit && !isDragging && !isResizing && (
        <div className="absolute top-1 left-1 w-3 h-3 bg-primary/70 rounded-full opacity-60" />
      )}
    </div>
  );
};
