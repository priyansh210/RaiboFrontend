
/**
 * API configuration settings
 */

// Base API URL - could be replaced with a real API endpoint in production
export const API_BASE_URL = 'https://api.example.com';

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  CART: 'cart',
};

// API request timeouts
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// Simulate network latency for mock APIs (in milliseconds)
export const SIMULATED_DELAY = import.meta.env.PROD ? 0 : 500;
