
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, loadCart, saveCart, calculateCartTotals } from '../services/CartService';
import { Product } from '../data/products';

interface CartContextProps {
  cartItems: CartItem[];
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

const CartContext = createContext<CartContextProps>({
  cartItems: [],
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
        return [...prevItems, { ...product, quantity: product.quantity }];
      }
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
