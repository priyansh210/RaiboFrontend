
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../data/products';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();
  const { isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Allow guests to add to cart but show different message
    addToCart({
      ...product,
      selectedColor,
      quantity: 1,
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

  return (
    <div 
      className="group bg-white rounded-sm overflow-hidden transition-all duration-300 hover:card-shadow animate-fade-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="bg-terracotta text-white text-xs px-2 py-1 uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}
          
          {/* Color options */}
          <div className="absolute bottom-4 left-4 flex space-x-1">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color);
                }}
                aria-label={`Select ${color.name} color`}
                className={`w-6 h-6 rounded-full transition-transform ${
                  selectedColor.code === color.code ? 'ring-2 ring-white ring-offset-1' : ''
                }`}
                style={{ backgroundColor: color.code }}
              />
            ))}
          </div>
          
          {/* Quick actions */}
          <div 
            className={`absolute top-4 right-4 flex flex-col space-y-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button 
              onClick={handleWishlistClick}
              aria-label="Add to wishlist"
              className="bg-white/90 hover:bg-white text-charcoal p-2 rounded-full shadow-sm transition-all"
            >
              <Heart size={18} />
            </button>
            <button 
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="bg-terracotta hover:bg-umber text-white p-2 rounded-full shadow-sm transition-all"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-charcoal">{product.name}</h3>
              <p className="text-sm text-earth mt-1">{product.brand}</p>
            </div>
            <span className="font-medium text-charcoal">${product.price.toFixed(2)}</span>
          </div>
          
          <p className="text-xs text-earth mt-2">{product.deliveryInfo}</p>
          
          <button
            onClick={handleAddToCart}
            className="w-full mt-4 py-2 bg-sand hover:bg-taupe hover:text-white text-charcoal text-sm uppercase tracking-wider transition-colors font-medium"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
