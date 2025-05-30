
import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, getFormDataHeaders, REQUEST_TIMEOUT } from '../api/config';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('ApiService initialized with baseURL:', this.baseURL);
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('Making API request to:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const config: RequestInit = {
      signal: controller.signal,
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      console.log('Request config:', config);
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('API request failed:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your internet connection.');
        }
      }
      
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    fullname: string;
    phone: string;
    email: string;
    password: string;
  }) {
    console.log('Registering user:', { ...userData, password: '[HIDDEN]' });
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    console.log('Logging in user:', { email: credentials.email, password: '[HIDDEN]' });
    return this.request(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken() {
    return this.request(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
    });
  }

  // Product methods
  async getProducts() {
    return this.request(API_ENDPOINTS.PRODUCTS.GET_ALL);
  }

  async getProductById(id: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.GET_BY_ID}/${id}`);
  }

  async searchProducts(query: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}`);
  }

  // Cart methods
  async getCart() {
    return this.request(API_ENDPOINTS.CART.GET);
  }

  async addToCart(buyerId: string, productData: { product_id: string; quantity: number }) {
    return this.request(`${API_ENDPOINTS.CART.ADD}/${buyerId}/add`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async removeFromCart(buyerId: string, productData: { product_id: string }) {
    return this.request(`${API_ENDPOINTS.CART.REMOVE}/${buyerId}/remove`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async updateCartQuantity(buyerId: string, productData: { product_id: string; quantity: number }) {
    return this.request(`${API_ENDPOINTS.CART.UPDATE}/${buyerId}/update`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async clearCart(buyerId: string) {
    return this.request(`${API_ENDPOINTS.CART.DELETE}/${buyerId}`, {
      method: 'DELETE',
    });
  }

  // Order methods
  async createOrder(orderData: {
    cart_id: string;
    address_id: string;
    payment_method: string;
    receiver_name: string;
    receiver_phone: string;
    method_id: string;
    delivery_date: string;
  }) {
    return this.request(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(id: string) {
    return this.request(`${API_ENDPOINTS.ORDERS.GET_BY_ID}/${id}`);
  }

  // Payment Methods
  async getPaymentMethods() {
    return this.request(API_ENDPOINTS.PAYMENT_METHODS.GET_ALL);
  }

  async addPaymentMethod(paymentData: {
    card_number: string;
    card_holder: string;
    expiry_date: string;
  }) {
    return this.request(API_ENDPOINTS.PAYMENT_METHODS.CREATE, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePaymentMethod(id: string, paymentData: any) {
    return this.request(`${API_ENDPOINTS.PAYMENT_METHODS.UPDATE}/${id}`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePaymentMethod(id: string) {
    return this.request(`${API_ENDPOINTS.PAYMENT_METHODS.DELETE}/${id}`, {
      method: 'DELETE',
    });
  }

  // Address methods
  async getAddresses() {
    return this.request(API_ENDPOINTS.ADDRESS.GET_ALL);
  }

  async addAddress(addressData: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    receiver_name: string;
    receiver_phone: string;
  }) {
    return this.request(API_ENDPOINTS.ADDRESS.CREATE, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(id: string, addressData: any) {
    return this.request(`${API_ENDPOINTS.ADDRESS.UPDATE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(id: string) {
    return this.request(`${API_ENDPOINTS.ADDRESS.DELETE}/${id}`, {
      method: 'DELETE',
    });
  }

  // Image methods
  async uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return fetch(`${this.baseURL}${API_ENDPOINTS.IMAGES.UPLOAD}`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: formData,
    });
  }

  async getImageById(imageId: string) {
    return this.request(`${API_ENDPOINTS.IMAGES.GET_BY_ID}/${imageId}`);
  }

  async deleteImage(imageId: string) {
    return this.request(`${API_ENDPOINTS.IMAGES.DELETE}/${imageId}`);
  }
}

export const apiService = new ApiService();
