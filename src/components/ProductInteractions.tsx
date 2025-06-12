
import React, { useState } from 'react';
import { Heart, Share2, MessageCircle, Star } from 'lucide-react';
import { ProductInteraction } from '../models/internal/Product';
import { useIsMobile } from '../hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/ApiService';

interface ProductInteractionsProps {
  productId: string;
  interactions: ProductInteraction;
  ratings: { average: number; count: number };
  onLike: (productId: string) => void;
  onShare: (productId: string) => void;
  onComment?: (productId: string) => void;
  onDoubleClick?: (productId: string) => void;
  showCommentPreview?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const ProductInteractions: React.FC<ProductInteractionsProps> = ({
  productId,
  interactions,
  ratings,
  onLike,
  onShare,
  onComment,
  onDoubleClick,
  showCommentPreview = false,
  layout = 'horizontal',
}) => {
  const isMobile = useIsMobile();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await apiService.handleLike(productId);
      onLike(productId);
      
      toast({
        title: interactions.userHasLiked ? "Removed from favorites" : "Added to favorites",
        description: interactions.userHasLiked ? "Product unliked" : "Product liked",
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick(productId);
    } else {
      handleLike();
    }
  };

  if (layout === 'vertical') {
    return (
      <div className="flex flex-col items-center space-y-4 py-4">
        <button
          onClick={handleLike}
          onDoubleClick={handleDoubleClick}
          disabled={isLiking}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            interactions.userHasLiked ? 'text-red-500' : 'text-white hover:text-red-500'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart size={24} fill={interactions.userHasLiked ? 'currentColor' : 'none'} />
          <span className="text-xs">{interactions.likes}</span>
        </button>
        
        <button
          onClick={() => onComment?.(productId)}
          className="flex flex-col items-center space-y-1 text-white hover:text-green-500 transition-colors"
        >
          <MessageCircle size={24} />
          <span className="text-xs">{interactions.comments.length}</span>
        </button>
        
        <button
          onClick={() => onShare(productId)}
          className="flex flex-col items-center space-y-1 text-white hover:text-blue-500 transition-colors"
        >
          <Share2 size={24} />
          <span className="text-xs">{interactions.shares}</span>
        </button>
        
        <div className="flex flex-col items-center space-y-1 text-white">
          <Star size={20} className="text-yellow-400 fill-current" />
          <span className="text-xs">{ratings.average}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-gray-100">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={handleLike}
            onDoubleClick={handleDoubleClick}
            disabled={isLiking}
            className={`flex items-center space-x-1 transition-colors ${
              interactions.userHasLiked ? 'text-red-500' : 'hover:text-red-500'
            } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart size={isMobile ? 14 : 16} fill={interactions.userHasLiked ? 'currentColor' : 'none'} />
            <span className="text-xs md:text-sm">{interactions.likes}</span>
          </button>
          
          <button
            onClick={() => onShare(productId)}
            className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
          >
            <Share2 size={isMobile ? 14 : 16} />
            <span className="text-xs md:text-sm">{interactions.shares}</span>
          </button>
          
          <button
            onClick={() => onComment?.(productId)}
            className="flex items-center space-x-1 hover:text-green-500 transition-colors"
          >
            <MessageCircle size={isMobile ? 14 : 16} />
            <span className="text-xs md:text-sm">{interactions.comments.length}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Star size={isMobile ? 12 : 14} className="text-yellow-400 fill-current" />
          <span className="text-xs md:text-sm">{ratings.average}</span>
        </div>
      </div>
      
      {/* Latest comment preview */}
      {showCommentPreview && interactions.comments.length > 0 && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
          <div className="font-medium">{interactions.comments[0].userName}</div>
          <div className="truncate">{interactions.comments[0].comment}</div>
        </div>
      )}
    </div>
  );
};

export default ProductInteractions;
