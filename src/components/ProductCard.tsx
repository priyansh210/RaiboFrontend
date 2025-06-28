import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Plus, Eye, Star, Users, TrendingUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Product, ProductColor } from '../models/internal/Product';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useIsMobile } from '../hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import AddProductDialog from './AddProductDialog';
import { productService } from '../services/ProductService';

interface ProductCardProps {
  product: Product;
  badge?: string;
  onLike?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, badge, onLike }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.userPreferences?.preferredColors?.[0] || { name: 'Default', code: '#000000' }
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(product.interactions?.userHasLiked || false);
  const [likes, setLikes] = useState(product.interactions?.likes ?? Math.floor(Math.random() * 200) + 10);
  const { addToCart } = useCart();
  const { isAuthenticated, isGuest } = useAuth();
  const { isDark, theme } = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      ...product,
      selectedColor,
      quantity: product.userPreferences?.preferredQuantity || 1,
    });

    if (isGuest) {
      toast({
        title: "Added to cart",
        description: "Sign in to save your cart and access order history.",
        duration: 4000,
      });
    } else {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    }
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to alike items",
        action: (
          <ToastAction 
            altText="Sign In" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </ToastAction>
        ),
      });
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    // Optimistically update UI
    const prevLiked = userHasLiked;
    const prevLikes = likes;
    setUserHasLiked(!userHasLiked);
    setLikes(likes + (userHasLiked ? -1 : 1));
    try {
      await productService.likeProduct(product.id);
      if (onLike) {
        onLike(product.id);
      }
      toast({
        title: !prevLiked ? "Liked item" : "Unliked item",
        description: `${product.name} has been ${!prevLiked ? 'added to' : 'removed from'} users likes.`,
      });
    } catch (err) {
      // Revert UI on error
      setUserHasLiked(prevLiked);
      setLikes(prevLikes);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access the Rooms and Boards feature.",
        action: (
          <ToastAction 
            altText="Sign In" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </ToastAction>
        ),
      });
    } else {
      setShowAddDialog(true);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://picsum.photos/200';
  };

  // Generate random values for demonstration if not present
  const views = product.interactions?.views ?? Math.floor(Math.random() * 5000) + 100;
  const orderCount = product.interactions?.orderCount ?? Math.floor(Math.random() * 100) + 5;
  const avgRating = product.averageRating || (Math.random() * 2 + 3); // Between 3-5
  const totalRatings = product.totalRatings || Math.floor(Math.random() * 500) + 10;

  // Utility functions for formatting numbers
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Calculate dynamic height based on image aspect ratio for Pinterest effect
  const aspectRatio = Math.random() * 0.5 + 0.75; // Random aspect ratio between 0.75 and 1.25
  const imageHeight = `${200 + Math.random() * 100}px`; // Random height between 200-300px

  return (
    <>
      <div 
        className={`group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border-2 animate-fade-up backdrop-blur-sm ${
          isDark 
            ? 'bg-zinc-900/90 border-zinc-700 hover:border-zinc-600' 
            : 'bg-white/90 border-gray-100 hover:border-gray-200'
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden" style={{ height: imageHeight }}>
            <img 
              src={product.images?.[0] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={handleImageError}
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {badge && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs font-semibold">
                  {badge}
                </Badge>
              )}
              {product.new && (
                <Badge variant="secondary" className="bg-terracotta text-white text-xs">
                  New
                </Badge>
              )}
              {product.trending && (
                <Badge variant="secondary" className="bg-umber text-white text-xs flex items-center gap-1">
                  <TrendingUp size={10} />
                  Trending
                </Badge>
              )}
              {product.bestSeller && (
                <Badge variant="secondary" className="bg-taupe text-white text-xs">
                  Best Seller
                </Badge>
              )}
            </div>

            {/* Discount badge */}
            {product.discount > 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="text-xs font-bold">
                  -{product.discount}% OFF
                </Badge>
              </div>
            )}

            {/* Product views icon - move to top right, below discount badge if present */}
            <div className="absolute top-3 right-3 mt-8 flex items-center gap-1 px-2 py-1 rounded-full text-xs backdrop-blur-sm z-10"
              style={{ marginTop: product.discount > 0 ? '2.5rem' : '0' }}>
              <Eye size={12} />
              <span>{formatNumber(views)}</span>
            </div>

            {/* Action buttons overlay - Always visible on mobile, hover on desktop */}
            {(isHovered || isMobile) && (
              <div className="absolute inset-0 bg-black/20 flex items-end justify-end p-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddClick}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 ${
                      isDark ? 'bg-zinc-800/90 hover:bg-zinc-700' : 'bg-white/90 hover:bg-white'
                    }`}
                    title="Add to Room or Board"
                  >
                    <Plus size={16} className="text-primary" />
                  </button>
                  <button
                    onClick={handleWishlistClick}
                    disabled={isLiking}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 ${
                      isDark ? 'bg-zinc-800/90 hover:bg-zinc-700' : 'bg-white/90 hover:bg-white'
                    }`}
                    title="Like Product"
                  >
                    <Heart 
                      size={16} 
                      className={`transition-colors ${userHasLiked ? 'text-terracotta fill-terracotta' : 'text-taupe'} ${isLiking ? 'animate-pulse' : ''}`}
                    />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-all duration-200 shadow-lg hover:scale-110"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={16} className="text-primary-foreground" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Color options */}
            {product.userPreferences?.preferredColors && product.userPreferences.preferredColors.length > 0 && (
              <div className="absolute bottom-3 left-3 flex space-x-1">
                {product.userPreferences.preferredColors.slice(0, 3).map((color) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(color);
                    }}
                    aria-label={`Select ${color.name} color`}
                    className={`w-4 h-4 rounded-full transition-all duration-200 border-2 border-white shadow-sm hover:scale-110 ${
                      selectedColor.code === color.code ? 'ring-2 ring-white ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color.code }}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Rating and social proof */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({formatNumber(totalRatings)})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart size={12} className="text-terracotta" />
                <span>{formatNumber(likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} className="text-olive" />
                <span>{formatNumber(orderCount)}</span>
              </div>
            </div>
          </div>

          {/* Product name and company */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-1 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              by {product.company.name}
            </p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Price and availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-bold text-primary">
                ${product.price}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Stock status */}
            {product.stockCount !== undefined && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                product.stockCount > 10 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : product.stockCount > 0
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {product.stockCount > 10 ? 'In Stock' : product.stockCount > 0 ? `${product.stockCount} left` : 'Out of Stock'}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddProductDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
