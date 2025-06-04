import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductColor } from '../models/internal/Product';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useIsMobile } from '../hooks/use-mobile';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.userPreferences?.preferredColors?.[0] || { name: 'Default', code: '#000000' } // Default color if undefined or empty
  );
  const { addToCart } = useCart();
  const { isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // addToCart({
    //   ...product,
    //   selectedColor,
    //   quantity: product.userPreferences?.preferredQuantity || 1, // Use preferred quantity
    // });

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://picsum.photos/200'; // Fallback image
  };

  return (
    <div 
      className="group bg-white rounded-sm overflow-hidden transition-all duration-300 hover:card-shadow animate-fade-up"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.images?.[0] || '/placeholder-image.jpg'} // Handle undefined or empty images
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={handleImageError} // Fallback to placeholder image if the image fails to load
          />
          
          {badge && (
            <div className="absolute top-2 md:top-3 left-2 md:left-3">
              <span className="bg-terracotta text-white text-xs px-2 py-1 uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}
          
          {/* Color options */}
          {product.userPreferences?.preferredColors && product.userPreferences.preferredColors.length > 0 && (
            <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 flex space-x-1">
              {product.userPreferences.preferredColors.slice(0, 4).map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                  aria-label={`Select ${color.name} color`}
                  className={`w-4 h-4 md:w-6 md:h-6 rounded-full transition-transform ${
                    selectedColor.code === color.code ? 'ring-2 ring-white ring-offset-1' : ''
                  }`}
                  style={{ backgroundColor: color.code }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;