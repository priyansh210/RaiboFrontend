
import React, { createContext, useContext, useReducer } from 'react';
import { Product } from '@/models/internal/Product';

interface TempCartItem {
  product: Product;
  quantity: number;
}

interface TempCartState {
  items: TempCartItem[];
  isOpen: boolean;
}

type TempCartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_DIALOG' }
  | { type: 'SET_DIALOG'; payload: boolean };

const initialState: TempCartState = {
  items: [],
  isOpen: false,
};

function tempCartReducer(state: TempCartState, action: TempCartAction): TempCartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'TOGGLE_DIALOG':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case 'SET_DIALOG':
      return {
        ...state,
        isOpen: action.payload,
      };
    default:
      return state;
  }
}

interface TempCartContextType {
  state: TempCartState;
  dispatch: React.Dispatch<TempCartAction>;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDialog: () => void;
  setDialogOpen: (open: boolean) => void;
  getTotalPrice: () => number;
  getTotalDiscount: () => number;
  getItemCount: () => number;
}

const TempCartContext = createContext<TempCartContextType | undefined>(undefined);

export const TempCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tempCartReducer, initialState);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleDialog = () => {
    dispatch({ type: 'TOGGLE_DIALOG' });
  };

  const setDialogOpen = (open: boolean) => {
    dispatch({ type: 'SET_DIALOG', payload: open });
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return state.items.reduce((total, item) => {
      const discountAmount = (item.product.price * item.product.discount / 100) * item.quantity;
      return total + discountAmount;
    }, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <TempCartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleDialog,
        setDialogOpen,
        getTotalPrice,
        getTotalDiscount,
        getItemCount,
      }}
    >
      {children}
    </TempCartContext.Provider>
  );
};

export const useTempCart = () => {
  const context = useContext(TempCartContext);
  if (context === undefined) {
    throw new Error('useTempCart must be used within a TempCartProvider');
  }
  return context;
};
