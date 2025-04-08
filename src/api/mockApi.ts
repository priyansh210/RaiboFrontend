
import { SIMULATED_DELAY, STORAGE_KEYS } from './config';
import { ApiResponse, AuthUser, LoginCredentials, RegisterCredentials, ApiProduct, Order } from './types';
import { mockUsers, mockProducts, mockOrders } from './mockData';

/**
 * Helper function to simulate API delay
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generic response creator with proper typing
 */
const createResponse = <T>(data: T | null = null, error: string | null = null, status: number = 200): ApiResponse<T> => {
  return { data, error, status };
};

/**
 * Mock authentication API methods
 */
export const authApi = {
  /**
   * Log in with email and password
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> => {
    await delay(SIMULATED_DELAY);
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      return createResponse(null, 'Invalid email or password', 401);
    }
    
    const { password, ...userWithoutPassword } = user;
    
    // Store user in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `mock-token-${user.id}`);
    
    return createResponse(userWithoutPassword as AuthUser);
  },
  
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthUser>> => {
    await delay(SIMULATED_DELAY);
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === credentials.email)) {
      return createResponse(null, 'Email already in use', 409);
    }
    
    // Create new user (in a real app this would be done on the server)
    const newUser = {
      id: `user-${Date.now()}`,
      email: credentials.email,
      password: credentials.password,
      firstName: credentials.firstName || '',
      lastName: credentials.lastName || '',
      roles: [credentials.role]
    };
    
    // In a real app, we would add the user to a database
    // Here we're just simulating a successful response
    
    const { password, ...userWithoutPassword } = newUser;
    
    // Store user in localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `mock-token-${newUser.id}`);
    
    return createResponse(userWithoutPassword as AuthUser);
  },
  
  /**
   * Log out the current user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    await delay(SIMULATED_DELAY);
    
    // Clear user data from localStorage
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    
    return createResponse(null);
  },
  
  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    await delay(SIMULATED_DELAY / 2); // Faster check
    
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (!userJson) {
      return createResponse(null, 'Not authenticated', 401);
    }
    
    try {
      const user = JSON.parse(userJson) as AuthUser;
      return createResponse(user);
    } catch (error) {
      return createResponse(null, 'Invalid user data', 500);
    }
  }
};

/**
 * Mock products API methods
 */
export const productsApi = {
  /**
   * Get all products
   */
  getProducts: async (): Promise<ApiResponse<ApiProduct[]>> => {
    await delay(SIMULATED_DELAY);
    return createResponse(mockProducts);
  },
  
  /**
   * Get a single product by ID
   */
  getProductById: async (id: string): Promise<ApiResponse<ApiProduct>> => {
    await delay(SIMULATED_DELAY);
    
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return createResponse(null, 'Product not found', 404);
    }
    
    return createResponse(product);
  },
  
  /**
   * Search products by query
   */
  searchProducts: async (query: string): Promise<ApiResponse<ApiProduct[]>> => {
    await delay(SIMULATED_DELAY);
    
    const searchTerm = query.toLowerCase();
    
    const filteredProducts = mockProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
    
    return createResponse(filteredProducts);
  },
  
  /**
   * Get similar products
   */
  getSimilarProducts: async (productId: string, limit: number = 4): Promise<ApiResponse<ApiProduct[]>> => {
    await delay(SIMULATED_DELAY);
    
    const product = mockProducts.find(p => p.id === productId);
    
    if (!product) {
      return createResponse([], 'Product not found', 404);
    }
    
    const similarProducts = mockProducts
      .filter(p => 
        p.id !== productId && 
        (p.category === product.category || p.subcategory === product.subcategory)
      )
      .slice(0, limit);
    
    return createResponse(similarProducts);
  }
};

/**
 * Mock orders API methods
 */
export const ordersApi = {
  /**
   * Get orders for the current user
   */
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    await delay(SIMULATED_DELAY);
    
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (!userJson) {
      return createResponse(null, 'Not authenticated', 401);
    }
    
    const user = JSON.parse(userJson) as AuthUser;
    
    // For buyers, return their orders
    if (user.roles.includes('buyer')) {
      const userOrders = mockOrders.filter(order => order.buyer_id === user.id);
      return createResponse(userOrders);
    }
    
    // For sellers, would return orders for their products
    // This is a simplified implementation
    if (user.roles.includes('seller')) {
      return createResponse(mockOrders);
    }
    
    return createResponse([], 'Unauthorized', 403);
  },
  
  /**
   * Create a new order
   */
  createOrder: async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<ApiResponse<Order>> => {
    await delay(SIMULATED_DELAY);
    
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (!userJson) {
      return createResponse(null, 'Not authenticated', 401);
    }
    
    // Create a new order (in a real app, this would be done on the server)
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    
    // In a real app, we would add the order to a database
    // Here we're just simulating a successful response
    
    return createResponse(newOrder);
  }
};
