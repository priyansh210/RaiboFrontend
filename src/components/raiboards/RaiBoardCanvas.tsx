import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RaiBoard, RaiBoardProduct, RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { ProductCard } from './ProductCard';
import { TextElement } from './TextElement';
import { ZoomControls } from './ZoomControls';
import SimilarProductsDialog from './SimilarProductsDialog';

interface RaiBoardCanvasProps {
  board: RaiBoard;
  onProductMove: (productId: string, position: { x: number; y: number }, zIndex?: number) => void;
  onProductResize: (productId: string, size: { width: number; height: number }) => void;
  onProductRemove: (productId: string) => void;
  onProductDoubleClick: (productId: string) => void;
  onTextElementMove: (elementId: string, position: { x: number; y: number }, zIndex?: number) => void;
  onTextElementResize: (elementId: string, size: { width: number; height: number }) => void;
  onTextElementUpdate: (elementId: string, updates: Partial<RaiBoardTextElement>) => void;
  onTextElementRemove: (elementId: string) => void;
  userRole: 'owner' | 'editor' | 'viewer';
  onOpenSimilarProducts?: (productId: string) => void;
}

export const RaiBoardCanvas: React.FC<RaiBoardCanvasProps> = ({
  board,
  onProductMove,
  onProductResize,
  onProductRemove,
  onProductDoubleClick,
  onTextElementMove,
  onTextElementResize,
  onTextElementUpdate,
  onTextElementRemove,
  userRole,
  onOpenSimilarProducts,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedTextElement, setSelectedTextElement] = useState<string | null>(null);
  const panRef = useRef(pan);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  // Refs for pinch-to-zoom functionality
  const touchStartDistance = useRef<number | null>(null);
  const touchStartZoom = useRef<number>(1);
  const lastTouchMidpoint = useRef<{ x: number, y: number } | null>(null);
  // Track if the user is interacting with a product/element to prevent canvas interactions
  const [isInteractingWithElement, setIsInteractingWithElement] = useState(false);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);
  
  const canEdit = userRole === 'owner' || userRole === 'editor';
  
  // Central function to deselect all items
  const deselectAllItems = useCallback(() => {
    setSelectedProduct(null);
    setSelectedTextElement(null);
    setIsInteractingWithElement(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
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

  // Touch event handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Check if touch is directly on the canvas background (not on a product or text element)
    if (e.currentTarget === e.target) {
      deselectAllItems();
      // Add visual feedback for tapping on empty canvas
      if (canvasRef.current) {
        canvasRef.current.classList.add('canvas-tapped');
        setTimeout(() => {
          if (canvasRef.current) canvasRef.current.classList.remove('canvas-tapped');
        }, 300);
      }
    }
    
    if (isInteractingWithElement) return;
    
    if (e.touches.length === 1) {
      // Single touch - prepare for panning
      setIsPanning(true);
      lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      
      // Add visual feedback for touch interaction
      if (canvasRef.current) {
        canvasRef.current.classList.add('touching');
      }
    } else if (e.touches.length === 2) {
      // Two finger touch - prepare for pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      touchStartDistance.current = distance;
      touchStartZoom.current = zoom;
      
      // Calculate midpoint for pan adjustment during pinch zoom
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      lastTouchMidpoint.current = { x: midX, y: midY };
      
      // Add visual feedback for pinch zoom
      if (canvasRef.current) {
        canvasRef.current.classList.add('pinching');
      }
    }
  }, [zoom, isInteractingWithElement, deselectAllItems]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling while interacting with canvas
    
    if (e.touches.length === 1 && isPanning) {
      // Single touch - panning
      const deltaX = e.touches[0].clientX - lastPanPointRef.current.x;
      const deltaY = e.touches[0].clientY - lastPanPointRef.current.y;
      lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

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
    } else if (e.touches.length === 2 && touchStartDistance.current !== null) {
      // Two finger touch - pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate new zoom based on the change in distance
      const scaleFactor = distance / touchStartDistance.current;
      const newZoom = Math.max(
        board.settings.minZoom,
        Math.min(board.settings.maxZoom, touchStartZoom.current * scaleFactor)
      );
      
      // Calculate midpoint for this touch event
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      // Adjust pan position to keep the pinch point stable
      if (lastTouchMidpoint.current) {
        const deltaX = midX - lastTouchMidpoint.current.x;
        const deltaY = midY - lastTouchMidpoint.current.y;
        
        lastTouchMidpoint.current = { x: midX, y: midY };
        
        setPan(prev => {
          const newPan = { x: prev.x + deltaX, y: prev.y + deltaY };
          panRef.current = newPan;
          return newPan;
        });
      }
      
      setZoom(newZoom);
    }
  }, [isPanning, board.settings.minZoom, board.settings.maxZoom]);

  // Update handleTouchEnd to include visual feedback cleanup
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsPanning(false);
    touchStartDistance.current = null;
    lastTouchMidpoint.current = null;
    
    // If this was a tap on the canvas (not a drag), deselect items
    if (e.currentTarget === e.target && !isPanning) {
      deselectAllItems();
    }
    
    // Remove visual feedback
    if (canvasRef.current) {
      canvasRef.current.classList.remove('touching', 'pinching', 'canvas-tapped');
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [isPanning, deselectAllItems]);

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
    setIsInteractingWithElement(true);
  };

  const handleTextElementSelect = (elementId: string) => {
    setSelectedTextElement(elementId);
    setSelectedProduct(null);
    setIsInteractingWithElement(true);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
     deselectAllItems();
  };

  // For touch devices, we need a separate handler to clear selection
  const handleCanvasTap = useCallback((e: React.TouchEvent) => {
    // Only handle single touch taps on the canvas itself, not on children
    if (e.touches.length === 1 && e.currentTarget === e.target) {
      deselectAllItems();
    }
  }, [deselectAllItems]);

  // Enhanced grid pattern
  const gridSize = board.settings.gridSize * zoom;
  const gridOffsetX = (pan.x % gridSize);
  const gridOffsetY = (pan.y % gridSize);

  // Create mock product data for temp cart functionality
  const createMockProduct = (boardProduct: RaiBoardProduct) => ({
    id: boardProduct.productId,
    name: boardProduct.productName,
    description: `${boardProduct.productName} from RaiBoard`,
    price: boardProduct.productPrice,
    quantity: 100,
    category: { id: '1', name: 'Furniture' },
    company: { id: '1', name: 'RAIBO', email: 'contact@raibo.com', address: 'RAIBO HQ' },
    images: [boardProduct.productImage],
    imageUrls: [boardProduct.productImage],
    displayImage: boardProduct.productImage,
    discount: Math.floor(Math.random() * 30), // Random discount for demo
    discountValidUntil: null,
    averageRating: 4.5,
    totalRatings: 100,
    version: 1,
    interactions: {
      likes: 0,
      shares: 0,
      comments: [],
      userHasLiked: false,
      userHasShared: false,
    },
    colors: [{ name: 'Default', code: '#000000' }],
  });  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-background to-secondary"
      onClick={handleCanvasClick} // Add click handler here
    >
      {/* Enhanced Grid Background */}
      {board.settings.showGrid && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
          }}
        />
      )}

      {/* Mobile Touch Hints */}
      {/* <div className="absolute top-2 left-2 right-2 px-3 py-2 bg-background/70 backdrop-blur-sm rounded-lg shadow-sm z-10 text-xs text-muted-foreground md:hidden">
        <p>👆 One finger: Pan • 👆👆 Two fingers: Pinch to zoom</p>
      </div> */}

      {/* Canvas */}      <div 
        ref={canvasRef} 
        className="w-full h-full overflow-hidden relative select-none bg-muted/30 dark:bg-gray-800/20 transition-colors touch-manipulation"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          cursor: isPanning ? 'grabbing' : 'default',
          touchAction: 'none' // Prevent browser handling of touch gestures
        }}
      >
        {/* Mobile touch indicator - only shows when actively touching */}
        <div className="touch-indicator hidden pointer-events-none fixed bottom-20 left-1/2 -translate-x-1/2 bg-primary/80 text-white px-4 py-2 rounded-full text-sm font-medium z-50 opacity-0 transition-opacity">
          <span className="touching-text">Moving</span>
          <span className="pinching-text">Zooming</span>
        </div>
        
        {/* Canvas deselect helper - indicates when tapping empty canvas */}
        <div className="fixed inset-0 pointer-events-none bg-primary/5 dark:bg-primary/10 opacity-0 transition-opacity duration-300 z-10 canvas-tap-indicator"></div>

        {/* Canvas content */}      <div 
        className="absolute transition-transform ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: '3000px', // Default width for the board
          height: '2000px', // Default height for the board
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
              onResize={onProductResize}
              onRemove={onProductRemove}
              onDoubleClick={onProductDoubleClick}
              onSelect={handleProductSelect}
              zoom={zoom}
              actualProduct={createMockProduct(product)}
              onOpenSimilarProducts={onOpenSimilarProducts}
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
    </div>
  );
};
