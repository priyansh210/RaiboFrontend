
// Common API response structure
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName?: string;
  lastName?: string;
  role: 'buyer' | 'seller';
}

// Product types
export interface ProductColor {
  name: string;
  code: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  images: string[];
  colors: ProductColor[];
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  new: boolean;
  deliveryInfo: string;
  additionalInfo?: string[];
  seller_id?: string;
}

// Order types
export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  color?: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  total_amount: number;
  shipping_address: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

// Payment types
export interface PaymentMethod {
  id: string;
  card_number: string;
  card_holder: string;
  expiry_date: string;
  card_type: string;
}

export interface PaymentMethodsResponse {
  payment_methods: PaymentMethod[];
}

export interface CreateOrderResponse {
  orderId: string;
  error?: string;
}

export interface PaymentResponse {
  success: boolean;
  error?: string;
}

// Address types
export interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  receiver_name: string;
  receiver_phone: string;
  is_default?: boolean;
}

export interface AddressesResponse {
  addresses: Address[];
}
