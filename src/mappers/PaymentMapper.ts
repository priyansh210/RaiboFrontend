
import {
  StripePaymentIntent,
  StripePaymentMethod,
  StripeCheckoutSession,
} from '../models/external/StripeModels';
import {
  PaymentDetails,
  PaymentMethodDetails,
  CheckoutSession,
  PaymentStatus,
} from '../models/internal/Payment';

export class PaymentMapper {
  static mapExternalPaymentIntentToInternal(external: StripePaymentIntent): PaymentDetails {
    return {
      id: external.id,
      amount: external.amount / 100, // Convert from cents
      currency: external.currency,
      status: this.mapPaymentStatus(external.status),
      paymentMethodId: external.payment_method || '',
      orderId: external.metadata?.order_id || '',
      createdAt: new Date(),
    };
  }

  static mapExternalPaymentMethodToInternal(external: StripePaymentMethod): PaymentMethodDetails {
    return {
      id: external.id,
      type: 'card',
      card: {
        brand: external.card.brand,
        last4: external.card.last4,
        expiryMonth: external.card.exp_month,
        expiryYear: external.card.exp_year,
      },
      billingDetails: {
        name: external.billing_details.name,
        email: external.billing_details.email,
        address: external.billing_details.address ? {
          line1: external.billing_details.address.line1 || '',
          line2: external.billing_details.address.line2,
          city: external.billing_details.address.city || '',
          state: external.billing_details.address.state || '',
          postalCode: external.billing_details.address.postal_code || '',
          country: external.billing_details.address.country || 'US',
        } : undefined,
      },
      isDefault: false, // This would need to be determined from your system
    };
  }

  static mapExternalCheckoutSessionToInternal(external: StripeCheckoutSession): CheckoutSession {
    return {
      id: external.id,
      url: external.url,
      paymentStatus: external.payment_status === 'paid' ? 'paid' : 
                    external.payment_status === 'unpaid' ? 'unpaid' : 'pending',
      customerId: external.customer,
      paymentIntentId: external.payment_intent,
      totalAmount: external.amount_total / 100, // Convert from cents
      currency: external.currency,
    };
  }

  private static mapPaymentStatus(stripeStatus: StripePaymentIntent['status']): PaymentStatus {
    switch (stripeStatus) {
      case 'requires_payment_method':
      case 'requires_confirmation':
        return PaymentStatus.PENDING;
      case 'requires_action':
        return PaymentStatus.REQUIRES_ACTION;
      case 'processing':
      case 'requires_capture':
        return PaymentStatus.PROCESSING;
      case 'succeeded':
        return PaymentStatus.SUCCEEDED;
      case 'canceled':
        return PaymentStatus.CANCELED;
      default:
        return PaymentStatus.FAILED;
    }
  }
}
