import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductInteractions from './ProductInteractions';
import { Product } from '../models/internal/Product';
import { useIsMobile } from '../hooks/use-mobile';
import { Heart, MessageSquare, Plus, Share } from 'lucide-react';
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

  const handleAddToRoom = () => {
    // TODO: Implement add to room functionality
    console.log('Add to room:', product.id);
  };

  const handleAddToBoard = () => {
    // TODO: Implement add to board functionality
    console.log('Add to board:', product.id);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Full Screen Image Carousel */}
      <div
        className="absolute inset-0 w-full h-full"
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
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </CarouselItem>
            )) : (
              <CarouselItem className="h-full">
                <img 
                  src={'https://picsum.photos/400/600'} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>

        {/* Top Header with Company Info - Translucent Gradient */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent p-4 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm mr-3 flex-shrink-0">
                {/* Placeholder for company logo */}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{product.company.name}</h3>
                <p className="text-xs text-white/80">{product.category.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Actions */}
        {isMobile && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6">
            {/* Like Button */}
            <button
              onClick={() => onLike(product.id)}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Heart 
                  size={24} 
                  fill={product.interactions?.userHasLiked ? 'red' : 'none'} 
                  className={product.interactions?.userHasLiked ? 'text-red-500' : 'text-white'}
                />
              </div>
              <span className="text-xs font-medium">{product.interactions?.likes || 0}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onComment(product.id)}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <span className="text-xs font-medium">{product.interactions?.comments?.length || 0}</span>
            </button>

            {/* Add to Room Button */}
            <button
              onClick={handleAddToRoom}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-xs font-medium">Room</span>
            </button>

            {/* Add to Board Button */}
            <button
              onClick={handleAddToBoard}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Plus size={24} />
              </div>
              <span className="text-xs font-medium">Board</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => onShare(product.id)}
              className="flex flex-col items-center space-y-1 text-white"
            >
              <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Share size={24} />
              </div>
              <span className="text-xs font-medium">{product.interactions?.shares || 0}</span>
            </button>
          </div>
        )}

        {/* Bottom Content - Translucent Gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-8">
          <div className="text-white">
            <h4 className="font-bold text-xl mb-1">{product.name}</h4>
            <p className="text-white/90 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">${product.price.toFixed(2)}</span>
              <Link 
                to={`/product/${product.id}`} 
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Like Animation */}
        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-white text-8xl animate-ping">
              ❤️
            </div>
          </div>
        )}
      </div>

      {/* Desktop View - Keep existing layout */}
      {!isMobile && (
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
          <div className="relative overflow-hidden flex-grow">
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
        </div>
      )}
    </div>
  );
};

export default InstagramStylePost;
