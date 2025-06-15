
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductInteractions from './ProductInteractions';
import { Product } from '../models/internal/Product';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
  const [lastTap, setLastTap] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const handleDoubleClick = () => {
    // Only trigger like if the user hasn't liked it yet
    if (!product.interactions?.userHasLiked) {
      onLike(product.id);
    }
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 1000);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // This handler is for detecting double-taps on touch devices
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 400 && tapLength > 0) {
      e.stopPropagation();
      handleDoubleClick();
    }
    setLastTap(currentTime);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-muted mr-3 flex-shrink-0">
          {/* Placeholder for company logo */}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{product.company.name}</h3>
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
        </div>
      </div>

      {/* Image Carousel */}
      <div
        className="relative overflow-hidden flex-grow"
        onDoubleClick={handleDoubleClick}
        onTouchEnd={handleTouchEnd}
      >
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {(product.images && product.images.length > 0) ? product.images.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </CarouselItem>
            )) : (
              <CarouselItem className="h-full">
                <img 
                  src={'https://picsum.photos/400/600'} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>

        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-8xl" style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              ❤️
            </div>
          </div>
        )}

        {isMobile && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
            <ProductInteractions
              productId={product.id}
              interactions={product.interactions!}
              ratings={{ average: product.averageRating, count: product.totalRatings }}
              onLike={onLike}
              onShare={onShare}
              onComment={onComment}
              layout="vertical"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 border-t border-border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="font-semibold text-foreground">{product.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          </div>
          <span className="text-lg font-bold text-primary whitespace-nowrap">${product.price.toFixed(2)}</span>
        </div>
        <Link to={`/product/${product.id}`} className="text-sm font-medium text-primary hover:underline mt-2 inline-block">
          View Product Details
        </Link>
      </div>

      {!isMobile && (
        <div className="px-3 pb-3">
          <ProductInteractions
            productId={product.id}
            interactions={product.interactions!}
            ratings={{ average: product.averageRating, count: product.totalRatings }}
            onLike={onLike}
            onShare={onShare}
            onComment={onComment}
            showCommentPreview={true}
          />
        </div>
      )}
    </div>
  );
};

export default InstagramStylePost;
