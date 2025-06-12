
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductColor } from '../models/internal/Product';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useIsMobile } from '../hooks/use-mobile';
import AddToRoomModal from './AddToRoomModal';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.userPreferences?.preferredColors?.[0] || { name: 'Default', code: '#000000' }
  );
  const [showAddToRoomModal, setShowAddToRoomModal] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, isGuest } = useAuth();
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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isGuest) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist.",
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
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleAddToRoom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isGuest) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to rooms.",
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
      setShowAddToRoomModal(true);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://picsum.photos/200';
  };

  // Calculate dynamic height based on image aspect ratio for Pinterest effect
  const aspectRatio = Math.random() * 0.5 + 0.75; // Random aspect ratio between 0.75 and 1.25
  const imageHeight = `${200 + Math.random() * 100}px`; // Random height between 200-300px

  return (
    <>
      <div 
        className="group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 animate-fade-up"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative overflow-hidden" style={{ height: imageHeight }}>
            <img 
              src={product.images?.[0] || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={handleImageError}
            />
            
            {badge && (
              <div className="absolute top-2 md:top-3 left-2 md:left-3">
                <span className="bg-terracotta text-white text-xs px-2 py-1 uppercase tracking-wider rounded">
                  {badge}
                </span>
              </div>
            )}
            
            {/* Action buttons overlay - Always visible on mobile, hover on desktop */}
            {(isHovered || isMobile) && (
              <div className="absolute inset-0 bg-black/20 flex items-end justify-end p-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToRoom}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg"
                    title="Add to Room"
                  >
                    <Home size={16} className="text-terracotta" />
                  </button>
                  <button
                    onClick={handleWishlistClick}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-lg"
                    title="Add to Wishlist"
                  >
                    <Heart size={16} className="text-terracotta" />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="w-8 h-8 md:w-10 md:h-10 bg-terracotta rounded-full flex items-center justify-center hover:bg-umber transition-colors shadow-lg"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={16} className="text-white" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Color options */}
            {product.userPreferences?.preferredColors && product.userPreferences.preferredColors.length > 0 && (
              <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 flex space-x-1">
                {product.userPreferences.preferredColors.slice(0, 3).map((color) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(color);
                    }}
                    aria-label={`Select ${color.name} color`}
                    className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-transform border border-white ${
                      selectedColor.code === color.code ? 'ring-1 ring-white ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color.code }}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-3 md:p-4">
          <h3 className="text-sm md:text-base font-medium text-charcoal mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-earth mb-2">{product.company.name}</p>
          <div className="flex items-center justify-between">
            <span className="text-base md:text-lg font-bold text-terracotta">
              ${product.price}
            </span>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </div>

      <AddToRoomModal
        isOpen={showAddToRoomModal}
        onClose={() => setShowAddToRoomModal(false)}
        productId={product.id}
        productName={product.name}
      />
    </>
  );
};

export default ProductCard;
