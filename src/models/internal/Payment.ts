
// Internal Payment models
export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId: string;
  customerId?: string;
  orderId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PaymentMethodDetails {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
  billingDetails: {
    name?: string;
    email?: string;
    address?: AddressDetails;
  };
  isDefault: boolean;
}

export interface AddressDetails {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ShippingDetails {
  name: string;
  phone?: string;
  address: AddressDetails;
}

export interface CheckoutSession {
  id: string;
  url: string;
  paymentStatus: 'paid' | 'unpaid' | 'pending';
  customerId?: string;
  paymentIntentId?: string;
  totalAmount: number;
  currency: string;
}

export const PaymentStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
  REQUIRES_ACTION: 'requires_action',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  paymentMethodId?: string;
  shippingDetails?: ShippingDetails;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutRequest {
  items: Array<{
    name: string;
    description?: string;
    price: number;
    quantity: number;
    images?: string[];
  }>;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  shippingRequired?: boolean;
  metadata?: Record<string, string>;
}
