
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { RaiBoard, RaiBoardProduct, RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';

interface RaiBoardState {
  board: RaiBoard | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
}

type RaiBoardAction =
  | { type: 'SET_BOARD'; payload: RaiBoard }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_PRODUCT'; payload: RaiBoardProduct }
  | { type: 'UPDATE_PRODUCT_POSITION'; payload: { productId: string; position: { x: number; y: number }; zIndex?: number } }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'ADD_TEXT_ELEMENT'; payload: RaiBoardTextElement }
  | { type: 'UPDATE_TEXT_ELEMENT_POSITION'; payload: { elementId: string; position: { x: number; y: number }; zIndex?: number } }
  | { type: 'UPDATE_TEXT_ELEMENT_SIZE'; payload: { elementId: string; size: { width: number; height: number } } }
  | { type: 'UPDATE_TEXT_ELEMENT'; payload: { elementId: string; updates: Partial<RaiBoardTextElement> } }
  | { type: 'REMOVE_TEXT_ELEMENT'; payload: string }
  | { type: 'MARK_SAVED' };

const initialState: RaiBoardState = {
  board: null,
  hasUnsavedChanges: false,
  isLoading: false,
};

function raiBoardReducer(state: RaiBoardState, action: RaiBoardAction): RaiBoardState {
  switch (action.type) {
    case 'SET_BOARD':
      return {
        ...state,
        board: action.payload,
        hasUnsavedChanges: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'ADD_PRODUCT':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          products: [...state.board.products, action.payload],
        },
        hasUnsavedChanges: true,
      };
    case 'UPDATE_PRODUCT_POSITION':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          products: state.board.products.map(p =>
            p.id === action.payload.productId
              ? {
                  ...p,
                  position: action.payload.position,
                  ...(action.payload.zIndex !== undefined && { zIndex: action.payload.zIndex }),
                }
              : p
          ),
        },
        hasUnsavedChanges: true,
      };
    case 'REMOVE_PRODUCT':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          products: state.board.products.filter(p => p.id !== action.payload),
        },
        hasUnsavedChanges: true,
      };
    case 'ADD_TEXT_ELEMENT':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          textElements: [...state.board.textElements, action.payload],
        },
        hasUnsavedChanges: true,
      };
    case 'UPDATE_TEXT_ELEMENT_POSITION':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          textElements: state.board.textElements.map(el =>
            el.id === action.payload.elementId
              ? {
                  ...el,
                  position: action.payload.position,
                  ...(action.payload.zIndex !== undefined && { zIndex: action.payload.zIndex }),
                }
              : el
          ),
        },
        hasUnsavedChanges: true,
      };
    case 'UPDATE_TEXT_ELEMENT_SIZE':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          textElements: state.board.textElements.map(el =>
            el.id === action.payload.elementId
              ? { ...el, size: action.payload.size }
              : el
          ),
        },
        hasUnsavedChanges: true,
      };
    case 'UPDATE_TEXT_ELEMENT':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          textElements: state.board.textElements.map(el =>
            el.id === action.payload.elementId
              ? { ...el, ...action.payload.updates }
              : el
          ),
        },
        hasUnsavedChanges: true,
      };
    case 'REMOVE_TEXT_ELEMENT':
      if (!state.board) return state;
      return {
        ...state,
        board: {
          ...state.board,
          textElements: state.board.textElements.filter(el => el.id !== action.payload),
        },
        hasUnsavedChanges: true,
      };
    case 'MARK_SAVED':
      return {
        ...state,
        hasUnsavedChanges: false,
      };
    default:
      return state;
  }
}

interface RaiBoardContextType {
  state: RaiBoardState;
  dispatch: React.Dispatch<RaiBoardAction>;
  addProductLocally: (product: Product, position: { x: number; y: number }) => void;
  addTextElementLocally: (type: 'heading' | 'paragraph', position: { x: number; y: number }) => void;
}

const RaiBoardContext = createContext<RaiBoardContextType | undefined>(undefined);

export const RaiBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(raiBoardReducer, initialState);

  const addProductLocally = (product: Product, position: { x: number; y: number }) => {
    const boardProduct: RaiBoardProduct = {
      id: 'local-product-' + Date.now(),
      productId: product.id,
      productName: product.name,
      productImage: product.displayImage || product.imageUrls[0] || '/placeholder.svg',
      productPrice: product.price,
      position,
      size: { width: 200, height: 200 },
      zIndex: 1,
      rotation: 0,
    };
    dispatch({ type: 'ADD_PRODUCT', payload: boardProduct });
  };

  const addTextElementLocally = (type: 'heading' | 'paragraph', position: { x: number; y: number }) => {
    const textElement: RaiBoardTextElement = {
      id: 'local-text-' + Date.now(),
      type,
      content: '',
      position,
      size: { width: 200, height: type === 'heading' ? 50 : 100 },
      zIndex: 1,
      fontSize: type === 'heading' ? 24 : 16,
      fontWeight: type === 'heading' ? 'bold' : 'normal',
      color: '#000000',
    };
    dispatch({ type: 'ADD_TEXT_ELEMENT', payload: textElement });
  };

  return (
    <RaiBoardContext.Provider value={{ state, dispatch, addProductLocally, addTextElementLocally }}>
      {children}
    </RaiBoardContext.Provider>
  );
};

export const useRaiBoard = () => {
  const context = useContext(RaiBoardContext);
  if (context === undefined) {
    throw new Error('useRaiBoard must be used within a RaiBoardProvider');
  }
  return context;
};
