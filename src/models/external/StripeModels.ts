
// External Stripe API models
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created: number;
  metadata: Record<string, string>;
}

export interface StripePaymentMethod {
  id: string;
  object: 'payment_method';
  type: 'card';
  card: {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
  };
  billing_details: {
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
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  payment_method?: string;
  metadata?: Record<string, string>;
  shipping?: {
    name: string;
    phone?: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  customer?: string;
  payment_intent?: string;
  amount_total: number;
  currency: string;
}

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  customer_id?: string;
  payment_method_id?: string;
  shipping?: {
    name: string;
    phone?: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionRequest {
  line_items: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  customer_email?: string;
  customer_id?: string;
  shipping_address_collection?: {
    allowed_countries: string[];
  };
  success_url: string;
  cancel_url: string;
  metadata?: Record<string, string>;
}
