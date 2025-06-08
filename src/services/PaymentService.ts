
import { apiService } from './ApiService';
import { PaymentDetails, PaymentMethodDetails, CheckoutSession, CreatePaymentRequest, CreateCheckoutRequest } from '../models/internal/Payment';
import { PaymentMapper } from '../mappers/PaymentMapper';

class PaymentService {
  // Create a Stripe checkout session
  async createCheckoutSession(request: CreateCheckoutRequest): Promise<CheckoutSession> {
    try {
      const response = await apiService.createStripeCheckoutSession({
        line_items: request.items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
              images: item.images,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        customer_email: request.customerEmail,
        shipping_address_collection: request.shippingRequired ? {
          allowed_countries: ['US', 'CA'],
        } : undefined,
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        metadata: request.metadata,
      });

      return PaymentMapper.mapExternalCheckoutSessionToInternal(response);
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  // Create a payment intent for direct payment processing
  async createPaymentIntent(request: CreatePaymentRequest): Promise<PaymentDetails> {
    try {
      const response = await apiService.createStripePaymentIntent({
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency,
        payment_method_id: request.paymentMethodId,
        shipping: request.shippingDetails ? {
          name: request.shippingDetails.name,
          phone: request.shippingDetails.phone,
          address: {
            line1: request.shippingDetails.address.line1,
            line2: request.shippingDetails.address.line2,
            city: request.shippingDetails.address.city,
            state: request.shippingDetails.address.state,
            postal_code: request.shippingDetails.address.postalCode,
            country: request.shippingDetails.address.country,
          },
        } : undefined,
        metadata: {
          order_id: request.orderId,
          ...request.metadata,
        },
      });

      return PaymentMapper.mapExternalPaymentIntentToInternal(response);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm a payment intent
  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentDetails> {
    try {
      const response = await apiService.confirmStripePaymentIntent(paymentIntentId, paymentMethodId);
      return PaymentMapper.mapExternalPaymentIntentToInternal(response);
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // Get payment methods for a customer
  async getPaymentMethods(): Promise<PaymentMethodDetails[]> {
    try {
      const response = await apiService.getStripePaymentMethods();
      return response.map(PaymentMapper.mapExternalPaymentMethodToInternal);
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      throw new Error('Failed to get payment methods');
    }
  }

  // Add a new payment method
  async addPaymentMethod(paymentMethodData: {
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
  }): Promise<PaymentMethodDetails> {
    try {
      const response = await apiService.createStripePaymentMethod(paymentMethodData);
      return PaymentMapper.mapExternalPaymentMethodToInternal(response);
    } catch (error) {
      console.error('Failed to add payment method:', error);
      throw new Error('Failed to add payment method');
    }
  }

  // Get payment status
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentDetails> {
    try {
      const response = await apiService.getStripePaymentIntent(paymentIntentId);
      return PaymentMapper.mapExternalPaymentIntentToInternal(response);
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw new Error('Failed to get payment status');
    }
  }

  // Process refund
  async processRefund(paymentIntentId: string, amount?: number): Promise<void> {
    try {
      await apiService.createStripeRefund(paymentIntentId, amount);
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw new Error('Failed to process refund');
    }
  }
}

export const paymentService = new PaymentService();
