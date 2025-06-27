
import { Product } from '@/models/internal/Product';

export interface CartItem extends Product {
  quantity: number;
  selectedColor: { name: string; code: string };
}

// Load cart from localStorage
export const loadCart = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem('raibo_cart');
    if (cartData) {
      return JSON.parse(cartData);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

// Save cart to localStorage
export const saveCart = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem('raibo_cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Calculate cart totals
export const calculateCartTotals = (cartItems: CartItem[]) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  
  const shipping = subtotal > 1000 ? 0 : 99;
  const tax = subtotal * 0.07; // Assuming 7% tax rate
  const total = subtotal + shipping + tax;
  
  return {
    subtotal,
    shipping,
    tax,
    total,
  };
};
