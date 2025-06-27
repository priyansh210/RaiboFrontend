import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, getFormDataHeaders, REQUEST_TIMEOUT } from '../api/config';
import { ExternalProductDetailSellerResponse, ExternalProductResponse } from '../models/external/ProductModels';
import { PaymentMethod, PaymentMethodsResponse, CreateOrderResponse, PaymentResponse, Address, AddressesResponse } from '../api/types';
import {
  StripeCheckoutSession,
  StripePaymentIntent,
  StripePaymentMethod,
  CreatePaymentIntentRequest,
  CreateCheckoutSessionRequest
} from '../models/external/StripeModels';
import { RaiBoard } from '@/models/internal/RaiBoard';
import { brands } from '../data/brandsData';
import { categories } from '../data/categoriesData';
import { forYouSuggestions } from '../data/forYouSuggestionsData';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('ApiService initialized with baseURL:', this.baseURL);
  }

  // Helper method to get endpoints
  getEndpoint(category: keyof typeof API_ENDPOINTS, endpoint: string): string {
    return API_ENDPOINTS[category][endpoint as keyof typeof API_ENDPOINTS[typeof category]];
  }

  // Generic request method - made public for use by other services
  async request<T>(
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

    const isFormData = options.body instanceof FormData;
    if (isFormData && config.headers) {
      if ('Content-Type' in config.headers) {
        delete config.headers['Content-Type'];
      }
    }

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
    role: string;
    companyName: string;
    taxId?: string;
  }) {
    const { fullname, phone: mobileNumber, email, password, role, companyName, taxId } = userData;

    const requestBody = {
      fullname,
      email,
      password,
      phone: mobileNumber,
      role,
      companyId: companyName, // Map companyName to companyId
      taxId, // Include taxId if required by the backend
    };

    console.log('Registering user:', { ...requestBody, password: '[HIDDEN]' });
    return this.request(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(requestBody),
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

  async googleLogin(access_token: string) {
    return this.request(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ access_token: access_token }), // Passport Google strategy expects access_token
    });
  }

  // Product API methods
  async handleLike(productId: string): Promise<void> {
    try {
      await this.request(`${API_ENDPOINTS.PRODUCTS.LIKE}`, {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      });
    } catch (error) {
      console.error('Failed to like product:', error);
      throw error;
    }
  }

  async createProduct(companyId: string, productData: any) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.CREATE}/${companyId}`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: JSON.stringify(productData),
    });
  }

  async getAllProductsBySeller(companyId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.GET_ALL}/${companyId}`);
  }

  async getProductById(productId: string) {
    const response = await this.request<{ product: ExternalProductResponse }>(`${API_ENDPOINTS.PRODUCTS.GET_BY_ID}/${productId}`);
    return response.product;
  }

  async getSellerProductById(productId: string) {
    const response = await this.request<{ product: ExternalProductDetailSellerResponse }>(`${API_ENDPOINTS.PRODUCTS.GET_BY_ID_FOR_SELLER}/${productId}`);
    return response.product;
  }

  async getAllProducts() {
    const response = await this.request<{ products: ExternalProductResponse[] }>(`${API_ENDPOINTS.PRODUCTS.GET_ALL}`);
    return response.products;
  }

  async getProductByIdForSeller(companyId: string, productId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.GET_BY_ID_FOR_SELLER}/${companyId}/${productId}`);
  }

  async updateProduct(companyId: string, productId: string, productData: any) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.UPDATE}/${companyId}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(companyId: string, productId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.DELETE}/${companyId}/${productId}`, {
      method: 'DELETE',
    });
  }

  async getAllPendingProducts() {
    return this.request(`${API_ENDPOINTS.PRODUCTS.ADMIN.PENDING}`, {
      method: 'GET',
    });
  }

  async approveProductByAdmin(productId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.ADMIN.APPROVE}/${productId}`, {
      method: 'PUT',
    });
  }

  async rejectProductByAdmin(productId: string, reason?: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.ADMIN.REJECT}/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(reason ? { reason } : {}),
    });
  }

  async addComment(referenceId: string, comment: string, onModel: 'Product' | 'KYC' = 'Product', type: 'external' | 'internal' = 'external') {
    return this.request(`${API_ENDPOINTS.PRODUCTS.COMMENT}`, {
      method: 'POST',
      body: JSON.stringify({
        content: comment,
        reference: referenceId,
        onModel: onModel,
        type: type,
        parentComment: null
      }),
    });
  }

  async replyToComment(commentId: string, reply: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.COMMENT}/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({
        "content": reply             // or parent comment ID for a reply
      }),
    });
  }

  //Implement search query
  async searchProducts(query?: string, imageFile?: File) {
    const formData = new FormData();
    if (query) {
      formData.append('text_query', query);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return this.request(`${API_ENDPOINTS.PRODUCTS.SEARCH}`, {
      method: 'POST',
      body: formData,
      headers: getFormDataHeaders(),

    });
  }

  async getCategories() {
    // Return dummy categories from data folder
    return categories;
  }

  // Cart methods
  async getCart() {
    const response = await this.request(API_ENDPOINTS.CART.GET);
    return response;
  }

  async addToCart(productData: { product_id: string; quantity: number }) {
    return this.request(`${API_ENDPOINTS.CART.ADD}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async removeFromCart(productData: { product_id: string }) {
    return this.request(`${API_ENDPOINTS.CART.REMOVE}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async updateQuantityInCart(productData: { product_id: string; quantity: number }) {
    return this.request(`${API_ENDPOINTS.CART.UPDATE}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async clearCart() {
    return this.request(`${API_ENDPOINTS.CART.DELETE}`, {
      method: 'DELETE',
    });
  }

  // Admin product approval methods
  async getPendingProducts() {
    return this.request(`${API_ENDPOINTS.PRODUCTS.ADMIN.PENDING}`);
  }

  async approveProduct(productId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.ADMIN.APPROVE}/${productId}`, {
      method: 'PUT',
    });
  }

  async rejectProduct(productId: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.ADMIN.REJECT}/${productId}`, {
      method: 'PUT',
    });
  }

  // Order methods with enhanced checkout functionality
  async createOrder(orderData: {
    cart_id: string;
    address_id: string;
    payment_method: string;
    receiver_name: string;
    receiver_phone: string;
    method_id: string;
    delivery_date: string;
  }){
    return this.request(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(id: string) {
    return this.request(`${API_ENDPOINTS.ORDERS.GET_BY_ID}/${id}`);
  }

  async getOrderByUserId() {
    return this.request(`${API_ENDPOINTS.ORDERS.GET_ALL}`);
  }


  // Enhanced Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this.request(API_ENDPOINTS.PAYMENT_METHODS.GET_ALL) as {cards : PaymentMethod[]};
    return response.cards || [];
  }

  async addPaymentMethod(paymentData: {
    card_number: string;
    card_holder: string;
    expiry_date: string;
    cvv?: string;
    card_type?: string;
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

  async processPayment(orderId : string) {
    return this.request(`${API_ENDPOINTS.PAYMENT.INITIATE}/${orderId}`, {
      method: 'POST',
    });
  }

  // Enhanced Address methods
  async getAddresses(): Promise<Address[]> {
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
    is_default?: boolean;
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

  async setDefaultAddress(id: string) {
    return this.request(`${API_ENDPOINTS.ADDRESS.UPDATE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_default: true }),
    });
  }

  // Image upload methods
  async uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append('image', imageFile);
    console.log('Uploading image:', imageFile.name);

    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.IMAGES.UPLOAD}`, {
      method: 'POST',
      headers: getFormDataHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image upload failed:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Image upload response:', data);
    return data.image; // Return only the image part of the response
  }

  async getImageById(imageId: string) {
    return this.request(`${API_ENDPOINTS.IMAGES.GET_BY_ID}/${imageId}`);
  }

  async deleteImage(imageId: string) {
    return this.request(`${API_ENDPOINTS.IMAGES.DELETE}/${imageId}`);
  }

  // Stripe Payment Methods
  async createStripeCheckoutSession(sessionData: CreateCheckoutSessionRequest): Promise<StripeCheckoutSession> {
    const response = await this.request<StripeCheckoutSession>('/api/v1/stripe/checkout-session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
    return response;
  }

  async createStripePaymentIntent(paymentData: CreatePaymentIntentRequest): Promise<StripePaymentIntent> {
    const response = await this.request<StripePaymentIntent>('/api/v1/stripe/payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response;
  }

  async confirmStripePaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<StripePaymentIntent> {
    const response = await this.request<StripePaymentIntent>(`/api/v1/stripe/payment-intent/${paymentIntentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    });
    return response;
  }

  async getStripePaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    const response = await this.request<StripePaymentIntent>(`/api/v1/stripe/payment-intent/${paymentIntentId}`);
    return response;
  }

  async getStripePaymentMethods(): Promise<StripePaymentMethod[]> {
    const response = await this.request<StripePaymentMethod[]>('/api/v1/stripe/payment-methods');
    return response;
  }

  async createStripePaymentMethod(paymentMethodData: {
    type: 'card';
    card: {
      number: string;
      exp_month: number;
      exp_year: number;
      cvc: string;
    };
    billing_details?: {
      name?: string;
      email?: string;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
    };
  }): Promise<StripePaymentMethod> {
    const response = await this.request<StripePaymentMethod>('/api/v1/stripe/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethodData),
    });
    return response;
  }

  async deleteStripePaymentMethod(paymentMethodId: string): Promise<void> {
    await this.request(`/api/v1/stripe/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  }

  async createStripeRefund(paymentIntentId: string, amount?: number): Promise<void> {
    await this.request('/api/v1/stripe/refund', {
      method: 'POST',
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided
      }),
    });
  }

  async getStripeCustomer(): Promise<any> {
    return this.request('/api/v1/stripe/customer');
  }

  async createStripeCustomer(customerData: {
    email: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, string>;
  }): Promise<any> {
    return this.request('/api/v1/stripe/customer', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  // Room API methods
  async createDummyRoom(roomData: {
    name: string;
    description?: string;
    room_type: string;
  }) {
    // Return dummy data for now
    const dummyRoom = {
      id: `room-${Date.now()}`,
      name: roomData.name,
      description: roomData.description || '',
      room_type: roomData.room_type,
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating room:', roomData);
    return Promise.resolve(dummyRoom);
  }

  async getUserRooms() {
    return this.request(`${API_ENDPOINTS.ROOMS.GET_ALL}`);
  }

  async getRoomById(roomId: string) {
    return this.request(`${API_ENDPOINTS.ROOMS.GET_ALL}/${roomId}`);
  }

  async createRoom(roomData: {
    name: string;
    description?: string;
    room_type: string;
  }) {
    return this.request(`${API_ENDPOINTS.ROOMS.CREATE}`, {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async addProductToRoom(roomId: string, productId: string) {
    return this.request(`${API_ENDPOINTS.ROOMS.PRODUCT}/${roomId}`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });
  }

  async removeProductFromRoom(roomId: string, productId: string) {
    return this.request(`${API_ENDPOINTS.ROOMS.PRODUCT}/${roomId}`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async deleteRoom(roomId: string) {
    return this.request(`${API_ENDPOINTS.ROOMS.DELETE}/${roomId}`, {
      method: 'DELETE',
    });
  }

  async getDummyUserRooms() {
    // Return dummy rooms data
    const dummyRooms = [
      {
        id: 'room-1',
        name: 'Living Room',
        description: 'Main living area with sofa and TV',
        room_type: 'living_room',
        items: [
          { id: '1', name: 'Modern Sofa', image: 'https://picsum.photos/200/200?random=1' },
          { id: '2', name: 'Coffee Table', image: 'https://picsum.photos/200/200?random=2' },
        ],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'room-2',
        name: 'Bedroom',
        description: 'Master bedroom with queen bed',
        room_type: 'bedroom',
        items: [
          { id: '3', name: 'Queen Bed', image: 'https://picsum.photos/200/200?random=3' },
        ],
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      },
      {
        id: 'room-3',
        name: 'Kitchen',
        description: 'Modern kitchen with island',
        room_type: 'kitchen',
        items: [],
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      },
    ];

    console.log('Fetching user rooms');
    return Promise.resolve({ rooms: dummyRooms });
  }

  async addItemToRoom(roomId: string, productId: string) {
    console.log('Adding item to room:', { roomId, productId });
    return Promise.resolve({ success: true });
  }

  async removeItemFromRoom(roomId: string, productId: string) {
    console.log('Removing item from room:', { roomId, productId });
    return Promise.resolve({ success: true });
  }

  async updateRoom(roomId: string, roomData: {
    name?: string;
    description?: string;
    room_type?: string;
  }) {
    console.log('Updating room:', { roomId, roomData });
    return Promise.resolve({ success: true });
  }

  async deleteDummyRoom(roomId: string) {
    console.log('Deleting room:', roomId);
    return Promise.resolve({ success: true });
  }

  // Board API methods
  async createBoard(boardData: {
    name: string,
    description: string,
    isPublic: boolean
  }
  ) {
    return this.request(`${API_ENDPOINTS.BOARDS.CREATE}`, {
      method: 'POST',
      body: JSON.stringify(boardData),
    });
  }

  async getBoards() {
    return this.request(`${API_ENDPOINTS.BOARDS.GET_ALL}`);
  }

  async getBoardById(boardId: string) {
    return this.request(`${API_ENDPOINTS.BOARDS.GET_BY_ID}/${boardId}`);
  }

  async updateBoard(boardId: string, boardData: RaiBoard) {
    return this.request(`${API_ENDPOINTS.BOARDS.UPDATE}/${boardId}`, {
      method: 'PUT',
      body: JSON.stringify(boardData),
    });
  }
  async addProductToBoard(boardId: string, productId: string) {
    return this.request(`${API_ENDPOINTS.BOARDS.ADD_PRODUCT}/${boardId}/${productId}`, {
      method: 'POST',
    });
  }
  async deleteBoard(boardId: string) {
    return this.request(`${API_ENDPOINTS.BOARDS.DELETE}/${boardId}`, {
      method: 'DELETE',
    });
  }

  async getBrands() {
    return brands;
  }

  async getForYouSuggestions() {
    return forYouSuggestions;
  }
}

export const apiService = new ApiService();
