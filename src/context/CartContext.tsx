
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Product } from '../data/products';

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

// Load cart from localStorage
export const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const savedCart = localStorage.getItem('raibo_cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

// Save cart to localStorage
export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('raibo_cart', JSON.stringify(cart));
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

  // Load cart from localStorage on initial render
  useEffect(() => {
    setCartItems(loadCart());
  }, []);

  // Update localStorage and totals whenever cart changes
  useEffect(() => {
    saveCart(cartItems);
    setCartTotals(calculateCartTotals(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product & { selectedColor: { name: string; code: string }; quantity: number }) => {
    setCartItems(prevItems => {
      // Check if product is already in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.selectedColor.code === product.selectedColor.code
      );

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += product.quantity;
        return updatedItems;
      } else {
        // Add new item to cart
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
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
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
