import { Order } from '../models/internal/Order';
import { apiService } from './ApiService';
import { OrderMapper } from '../mappers/OrderMapper';
import { ExternalOrderResponse } from '../models/external/ExternalOrderResponse';

export class OrderService {
  /**
   * Get all orders for the current user
   */
  static async getUserOrders(): Promise<Order[]> {
    try {
      // Use the real API to fetch user orders
      const response = await apiService.getOrderByUserId() as { orders?: ExternalOrderResponse[] };
      if (!response.orders) return [];
      return response.orders.map(OrderMapper.fromExternal);
    } catch (error) {
      console.error('Error fetching user orders:', error)
      ;
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      // Use the real API to fetch order by ID
      const apiOrder = await apiService.getOrderById(orderId) as any;
      if (!apiOrder) return null;
      return OrderMapper.fromExternal(apiOrder as import('../models/external/ExternalOrderResponse').ExternalOrderResponse);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  /**
   * Create a new order
   */
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      // Use the real API to create an order
      const response: any = await apiService.createOrder({
        cart_id: orderData.cartId,
        address_id: orderData.addressId,
        payment_method: orderData.paymentMethod,
        receiver_name: orderData.receiverName,
        receiver_phone: orderData.receiverPhone,
        method_id: orderData.methodId,
        delivery_date: orderData.deliveryDate ? orderData.deliveryDate.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      const apiOrder = response.order || response;
      return {
        ...orderData,
        id: apiOrder._id || apiOrder.id,
        createdAt: apiOrder.created_at ? new Date(apiOrder.created_at) : new Date(),
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}
