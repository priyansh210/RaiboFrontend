
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RaiBoard, RaiBoardProduct, RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { ProductCard } from './ProductCard';
import { TextElement } from './TextElement';
import { ZoomControls } from './ZoomControls';

interface RaiBoardCanvasProps {
  board: RaiBoard;
  onProductMove: (productId: string, position: { x: number; y: number }, zIndex?: number) => void;
  onProductRemove: (productId: string) => void;
  onProductDoubleClick: (productId: string) => void;
  onTextElementMove: (elementId: string, position: { x: number; y: number }, zIndex?: number) => void;
  onTextElementResize: (elementId: string, size: { width: number; height: number }) => void;
  onTextElementUpdate: (elementId: string, updates: Partial<RaiBoardTextElement>) => void;
  onTextElementRemove: (elementId: string) => void;
  userRole: 'owner' | 'editor' | 'viewer';
}

export const RaiBoardCanvas: React.FC<RaiBoardCanvasProps> = ({
  board,
  onProductMove,
  onProductRemove,
  onProductDoubleClick,
  onTextElementMove,
  onTextElementResize,
  onTextElementUpdate,
  onTextElementRemove,
  userRole,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(null);
  
  const panRef = useRef(pan);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);
  
  const canEdit = userRole === 'owner' || userRole === 'editor';

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
      setIsPanning(true);
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

   const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - lastPanPointRef.current.x;
    const deltaY = e.clientY - lastPanPointRef.current.y;
    lastPanPointRef.current = { x: e.clientX, y: e.clientY };

    // Use requestAnimationFrame for smoother updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      setPan(prev => {
        const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
        panRef.current = newPan;
        return newPan;
      });
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(board.settings.minZoom, Math.min(board.settings.maxZoom, prev + delta)));
  }, [board.settings]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(board.settings.maxZoom, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(board.settings.minZoom, prev - 0.2));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    setSelectedTextElement(null);
  };

  const handleTextElementSelect = (elementId: string) => {
    setSelectedTextElement(elementId);
    setSelectedProduct(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedProduct(null);
      setSelectedTextElement(null);
    }
  };

  // Grid pattern for background
  const gridSize = board.settings.gridSize * zoom;
  const gridOffsetX = (pan.x % gridSize);
  const gridOffsetY = (pan.y % gridSize);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {/* Grid Background */}
      {board.settings.showGrid && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #666 1px, transparent 2px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
          }}
        />
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0',
        }}
      >
        {/* Products */}
        {board.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProduct === product.id}
            canEdit={canEdit}
            onMove={onProductMove}
            onRemove={onProductRemove}
            onDoubleClick={onProductDoubleClick}
            onSelect={handleProductSelect}
            zoom={zoom}
          />
        ))}

        {/* Text Elements */}
        {board.textElements.map((element) => (
          <TextElement
            key={element.id}
            element={element}
            isSelected={selectedTextElement === element.id}
            canEdit={canEdit}
            onMove={onTextElementMove}
            onResize={onTextElementResize}
            onUpdate={onTextElementUpdate}
            onRemove={onTextElementRemove}
            onSelect={handleTextElementSelect}
            zoom={zoom}
          />
        ))}
      </div>

      {/* Zoom Controls */}
      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        minZoom={board.settings.minZoom}
        maxZoom={board.settings.maxZoom}
      />

      {/* Info Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
        <div className="font-medium">{board.name}</div>
        <div className="text-gray-500">Zoom: {Math.round(zoom * 100)}%</div>
        <div className="text-gray-500">Products: {board.products.length}</div>
        <div className="text-gray-500">Text Elements: {board.textElements.length}</div>
      </div>
    </div>
  );
};
