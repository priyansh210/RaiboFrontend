
/**
 * API configuration settings for RAIBO furniture shop
 */

// Base API URL - Updated to use your hosted backend
export const API_BASE_URL = 'http://127.0.0.1:3000';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    GOOGLE_LOGIN: '/api/v1/auth/login/google',
  },
  
  // Products
  PRODUCTS: {
    CREATE: '/api/v1/product',
    GET_ALL: '/api/v1/product',
    GET_BY_ID: '/api/v1/product', // Will append /:id
    SEARCH: '/api/v1/products/search',
  },
  
  // Cart
  CART: {
    GET: '/api/v1/cart/',
    ADD: '/cart', // Will append /:buyer_id/add
    REMOVE: '/cart', // Will append /:buyer_id/remove
    UPDATE: '/cart', // Will append /:buyer_id/update
    DELETE: '/cart', // Will append /:buyer_id
  },
  
  // Orders
  ORDERS: {
    CREATE: '/api/v1/order/',
    GET_BY_ID: '/api/v1/order', // Will append /:id
  },
  
  // Payment Methods
  PAYMENT_METHODS: {
    CREATE: '/api/v1/payment-methods',
    GET_ALL: '/api/v1/payment-methods',
    GET_BY_ID: '/api/v1/payment-methods', // Will append /:id
    UPDATE: '/api/v1/payment-methods/update', // Will append /:id
    DELETE: '/api/v1/payment-methods', // Will append /:id
  },
  
  // Address
  ADDRESS: {
    CREATE: '/api/v1/address',
    GET_ALL: '/api/v1/address',
    GET_BY_ID: '/api/v1/address', // Will append /:id
    UPDATE: '/api/v1/address', // Will append /:id
    DELETE: '/api/v1/address', // Will append /:id
  },
  
  // Images
  IMAGES: {
    UPLOAD: '/api/v1/image/upload',
    GET_BY_ID: '/api/v1/image', // Will append /:imageId
    DELETE: '/api/v1/image/delete', // Will append /:imageId
  },
  
  // Categories
  CATEGORIES: {
    CREATE: '/api/v1/category',
    GET_ALL: '/api/v1/categories',
  },
  
  // Companies
  COMPANIES: {
    CREATE: '/api/v1/company',
    GET_ALL: '/api/v1/company',
    GET_BY_ID: '/api/v1/company', // Will append /:id
    UPDATE: '/api/v1/company', // Will append /:id
    DELETE: '/api/v1/company', // Will append /:id
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'raibo_auth_token',
  USER: 'raibo_user',
  CART: 'raibo_cart',
};

// API request timeouts
export const REQUEST_TIMEOUT = 15000; // 15 seconds

// Simulated delay for mock API
export const SIMULATED_DELAY = 1000; // 1 second

// Common headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const getFormDataHeaders = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};
