import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders, getFormDataHeaders, REQUEST_TIMEOUT } from '../api/config';
import {ExternalProductResponse} from '../models/external/ProductModels';
import { PaymentMethod, PaymentMethodsResponse, CreateOrderResponse, PaymentResponse, Address, AddressesResponse } from '../api/types';
import { 
  StripeCheckoutSession, 
  StripePaymentIntent, 
  StripePaymentMethod, 
  CreatePaymentIntentRequest, 
  CreateCheckoutSessionRequest 
} from '../models/external/StripeModels';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('ApiService initialized with baseURL:', this.baseURL);
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

  // Product API methods
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
  async getAllProducts() {
    const response = await this.request<{ products: any[] }>(`${API_ENDPOINTS.PRODUCTS.GET_ALL}`);
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

  //Implement search query
  async searchProducts(query: string) {
    return this.request(`${API_ENDPOINTS.PRODUCTS.GET_ALL}`);
  }

  async getCategories() {
    const response = await this.request<{ categories: any[] }>(`${API_ENDPOINTS.CATEGORIES.GET_ALL}`);
    return response.categories || [];
  }

  // Cart methods
  async getCart() {
    const response = await this.request(API_ENDPOINTS.CART.GET);
    return response;
  }

  async addToCart( productData: { product_id: string; quantity: number }) {
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

  // Order methods with enhanced checkout functionality
  async createOrder(orderData: {
    cart_id: string;
    address_id: string;
    payment_method: string;
    receiver_name: string;
    receiver_phone: string;
    method_id: string;
    delivery_date: string;
  }): Promise<CreateOrderResponse> {
    return this.request<CreateOrderResponse>(API_ENDPOINTS.ORDERS.CREATE, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(id: string) {
    return this.request(`${API_ENDPOINTS.ORDERS.GET_BY_ID}/${id}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request(`${API_ENDPOINTS.ORDERS.GET_BY_ID}/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Enhanced Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this.request<PaymentMethodsResponse>(API_ENDPOINTS.PAYMENT_METHODS.GET_ALL);
    return response.payment_methods || [];
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

  async processPayment(paymentData: {
    order_id: string;
    payment_method_id: string;
    amount: number;
    currency?: string;
  }): Promise<PaymentResponse> {
    return this.request<PaymentResponse>('/api/v1/payment/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
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
    const response = await this.request('/api/v1/stripe/checkout-session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
    return response as StripeCheckoutSession;
  }

  async createStripePaymentIntent(paymentData: CreatePaymentIntentRequest): Promise<StripePaymentIntent> {
    const response = await this.request('/api/v1/stripe/payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response as StripePaymentIntent;
  }

  async confirmStripePaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<StripePaymentIntent> {
    const response = await this.request(`/api/v1/stripe/payment-intent/${paymentIntentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    });
    return response as StripePaymentIntent;
  }

  async getStripePaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    const response = await this.request(`/api/v1/stripe/payment-intent/${paymentIntentId}`);
    return response as StripePaymentIntent;
  }

  async getStripePaymentMethods(): Promise<StripePaymentMethod[]> {
    const response = await this.request('/api/v1/stripe/payment-methods');
    return response as StripePaymentMethod[];
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
    const response = await this.request('/api/v1/stripe/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethodData),
    });
    return response as StripePaymentMethod;
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

  // Add admin endpoints to the existing AdminService class
  async getAllCompanies() {
    return this.request('/api/v1/admin/companies');
  }

  async getCompanyById(companyId: string) {
    return this.request(`/api/v1/admin/companies/${companyId}`);
  }

  async updateCompanyStatus(companyId: string, statusData: { status: string; comments?: string }) {
    return this.request(`/api/v1/admin/companies/${companyId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async getAllUsers() {
    return this.request('/api/v1/admin/users');
  }

  async getUserById(userId: string) {
    return this.request(`/api/v1/admin/users/${userId}`);
  }

  async updateUserStatus(userId: string, statusData: { status: string }) {
    return this.request(`/api/v1/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async getAllOrders() {
    return this.request('/api/v1/admin/orders');
  }

  async getOrderById(orderId: string) {
    return this.request(`/api/v1/admin/orders/${orderId}`);
  }

  async getPendingProductVerifications() {
    return this.request('/api/v1/admin/product-verifications/pending');
  }

  async verifyProduct(verificationId: string, verificationData: { status: string; comments?: string }) {
    return this.request(`/api/v1/admin/product-verifications/${verificationId}`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    });
  }

  async getPendingKycVerifications() {
    return this.request('/api/v1/admin/kyc-verifications/pending');
  }

  async verifyKyc(verificationId: string, verificationData: { status: string; comments?: string }) {
    return this.request(`/api/v1/admin/kyc-verifications/${verificationId}`, {
      method: 'PUT',
      body: JSON.stringify(verificationData),
    });
  }

  async getAdminCategories() {
    return this.request('/api/v1/admin/categories');
  }

  async createAdminCategory(categoryData: { name: string; description?: string; parentId?: string }) {
    return this.request('/api/v1/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateAdminCategory(categoryId: string, categoryData: { name?: string; description?: string; parentId?: string }) {
    return this.request(`/api/v1/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteAdminCategory(categoryId: string) {
    return this.request(`/api/v1/admin/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  async getAdminDashboardStats() {
    return this.request('/api/v1/admin/dashboard/stats');
  }
}

export const apiService = new ApiService();
