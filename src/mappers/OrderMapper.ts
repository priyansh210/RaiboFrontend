// OrderMapper.ts
// Maps between backend (external) and frontend (internal) order models
import { ExternalOrderResponse, ExternalOrderItemResponse } from '../models/external/ExternalOrderResponse';
import { Order, OrderItem } from '../models/internal/Order';

export class OrderMapper {
  static fromExternal(apiOrder: ExternalOrderResponse): Order {
    return {
      id: apiOrder._id,
      buyerId: apiOrder.user_id,
      cartId: apiOrder.cart_id,
      addressId: apiOrder.address,
      status: apiOrder.status,
      totalAmount: apiOrder.totalAmount,
      paymentMethod: apiOrder.payment_method,
      methodId: apiOrder.method_id,
      receiverName: apiOrder.receiver_name,
      receiverPhone: apiOrder.receiver_phone,
      deliveryDate: apiOrder.delivery_date ? new Date(apiOrder.delivery_date) : undefined,
      items: (apiOrder.orderItems || []).map(OrderMapper.mapOrderItem),
      createdAt: apiOrder.createdAt ? new Date(apiOrder.createdAt) : undefined,
      updatedAt: apiOrder.updatedAt ? new Date(apiOrder.updatedAt) : undefined
    };
  }

  static mapOrderItem(item: ExternalOrderItemResponse): OrderItem {
    return {
      id: item.product_id,
      productId: item.product_id,
      product: undefined as any, // Not available from backend order item
      price: 0, // Not available from backend order item
      quantity: item.quantity,
      itemStatus: item.status,
      // selectedColor is not available from backend order item
    };
  }
}
