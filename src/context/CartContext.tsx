import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Product } from '../models/internal/Product';
import { apiService } from '@/services/ApiService';

// Define CartItem type
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedColor: { name: string; code: string };
}

// Define context props
interface CartContextProps {
  cart_id?: string; // Optional cart ID for future use
  cartItems: CartItem[];
  cart: CartItem[]; // Added for compatibility
  total: number; // Added for total calculation
  addToCart: (product: Product & { selectedColor: { name: string; code: string }; quantity: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

// Load cart from the database
export const loadCart = async (): Promise<CartItem[]> => {
  try {
    const response = await apiService.getCart() as { cart: any };
    return response.cart.products.map((product: any) => ({
      id: product.product_id._id,
      name: product.product_id.name,
      price: product.product_id.price,
      image: product.product_id.imageUrls[0] || '/placeholder.svg',
      quantity: product.quantity,
      selectedColor: product.selectedColor || { name: 'Default', code: '#000000' },
    }));
  } catch (error) {
    console.error("Failed to load cart from API:", error);
    return [];
  }
};

// Save cart to the database
export const saveCart = async (cart: CartItem[]): Promise<void> => {
  // try {
  //   pass;
  // } catch (error) {
  //   console.error("Failed to save cart to API:", error);
  // }
};

// Calculate cart totals
export const calculateCartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 10 : 0; // Free shipping over $100
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
};

const CartContext = createContext<CartContextProps>({
  cartItems: [],
  cart: [], // Added for compatibility
  total: 0, // Added for total calculation
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotals: {
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  },
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  // Load cart from the database on initial render
  useEffect(() => {
    const fetchCart = async () => {
      const cart = await loadCart();
      setCartItems(cart);
    };
    fetchCart();
  }, []);

  // Update the database and totals whenever the cart changes
  useEffect(() => {
    saveCart(cartItems);
    setCartTotals(calculateCartTotals(cartItems));
  }, [cartItems]);

  const addToCart = async (product: Product & { selectedColor: { name: string; code: string }; quantity: number }) => {
    try {
      // Call the API to add the product to the cart
      await apiService.addToCart({
        product_id: product.id,
        quantity: product.quantity,
      });

      // Update the local cart state
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => item.id === product.id && item.selectedColor.code === product.selectedColor.code
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += product.quantity;
          return updatedItems;
        } else {
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg',
            quantity: product.quantity,
            selectedColor: product.selectedColor,
          };
          return [...prevItems, newItem];
        }
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      // Call the API to remove the product from the cart
      await apiService.removeFromCart({ product_id: productId });

      // Update the local cart state
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));

      toast({
        title: "Removed from cart",
        description: "The product has been removed from your cart.",
      });
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      // Call the API to update the product quantity in the cart
      await apiService.updateQuantityInCart({
        product_id: productId,
        quantity,
      });

      // Update the local cart state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );

      toast({
        title: "Cart updated",
        description: "The quantity has been updated in your cart.",
      });
    } catch (error) {
      console.error("Failed to update product quantity in cart:", error);
      toast({
        title: "Error",
        description: "Failed to update product quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      // Call the API to clear the cart
      await apiService.clearCart();

      // Update the local cart state
      setCartItems([]);

      toast({
        title: "Cart cleared",
        description: "Your cart has been cleared.",
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate total
  const total = cartTotals.total;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cart: cartItems, // Added for compatibility
        total, // Added for total
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};