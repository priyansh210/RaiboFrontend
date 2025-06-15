import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductInteractions from './ProductInteractions';
import { Product } from '../models/internal/Product';
import { useIsMobile } from '../hooks/use-mobile';
import { useTheme } from '../context/ThemeContext';

interface InstagramStylePostProps {
  product: Product;
  onLike: (productId: string) => void;
  onShare: (productId: string) => void;
  onComment: (productId: string) => void;
}

const InstagramStylePost: React.FC<InstagramStylePostProps> = ({
  product,
  onLike,
  onShare,
  onComment,
}) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [lastTap, setLastTap] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleDoubleClick = () => {
    onLike(product.id);
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 1000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    
    // Handle double tap
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      handleDoubleClick();
    }
    setLastTap(currentTime);

    // Handle swipe right to navigate to product detail
    const swipeDistance = touchEndX.current - touchStartX.current;
    if (swipeDistance > 100) {
      window.location.href = `/product/${product.id}`;
    }
  };

  const imageHeight = Math.floor(Math.random() * 200) + 300;

  return (
    <div 
      className="relative w-full mb-4 break-inside-avoid"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-100 dark:border-border/50">
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-muted mr-3"></div>
        <div>
          <h3 className="font-medium text-sm" style={{ color: theme.foreground }}>
            {product.company.name}
          </h3>
          <p className="text-xs" style={{ color: theme.mutedForeground }}>
            {product.category.name}
          </p>
        </div>
      </div>

      {/* Image */}
      <div 
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={isMobile ? undefined : handleDoubleClick}
      >
        <img 
          src={product.images?.[0] || 'https://picsum.photos/300/400'} 
          alt={product.name}
          className="w-full object-cover"
          style={{ height: `${imageHeight}px` }}
        />
        
        {/* Like animation */}
        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-6xl animate-ping">❤️</div>
          </div>
        )}

        {/* Swipe indicator */}
        {isMobile && (
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Swipe right →
          </div>
        )}

        {/* Mobile interactions overlay */}
        {isMobile && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ProductInteractions
              productId={product.id}
              interactions={product.interactions!}
              ratings={{ average: product.averageRating, count: product.totalRatings }}
              onLike={onLike}
              onShare={onShare}
              onComment={onComment}
              onDoubleClick={handleDoubleClick}
              layout="vertical"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-medium mb-2" style={{ color: theme.foreground }}>
          {product.name}
        </h4>
        <p className="text-sm mb-3" style={{ color: theme.mutedForeground }}>
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold" style={{ color: theme.primary }}>
            ${product.price}
          </span>
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Desktop interactions */}
      {!isMobile && (
        <ProductInteractions
          productId={product.id}
          interactions={product.interactions!}
          ratings={{ average: product.averageRating, count: product.totalRatings }}
          onLike={onLike}
          onShare={onShare}
          onComment={onComment}
          onDoubleClick={handleDoubleClick}
          showCommentPreview={true}
        />
      )}

      {/* View product link */}
      <div className="p-3 border-t border-gray-100 dark:border-border/50">
        <Link 
          to={`/product/${product.id}`}
          className="text-sm font-medium hover:underline"
          style={{ color: theme.primary }}
        >
          View Product Details
        </Link>
      </div>
    </div>
  );
};

export default InstagramStylePost;
