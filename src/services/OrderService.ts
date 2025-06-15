
import { Order } from '../models/internal/Order';
import { ordersApi } from '../api/mockApi';

export class OrderService {
  /**
   * Get all orders for the current user
   */
  static async getUserOrders(): Promise<Order[]> {
    try {
      const response = await ordersApi.getUserOrders();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.data) {
        return [];
      }
      
      // Map API response to internal Order model
      return response.data.map(apiOrder => ({
        id: apiOrder.id,
        buyerId: apiOrder.buyer_id,
        cartId: '', // Not provided in API response
        addressId: '', // Not provided in API response
        paymentMethod: 'Credit Card', // Default value
        receiverName: 'John Doe', // Default value
        receiverPhone: '+1234567890', // Default value
        methodId: '', // Not provided in API response
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        totalAmount: apiOrder.total_amount,
        status: apiOrder.status,
        items: apiOrder.items.map(item => ({
          id: item.product_id,
          productId: item.product_id,
          product: {
            id: item.product_id,
            name: `Product ${item.product_id}`,
            description: 'Product description',
            price: item.price,
            quantity: 10, // Default stock quantity
            category: {
              id: 'furniture',
              name: 'Furniture'
            },
            company: {
              id: 'company-1',
              name: 'Default Company',
              email: 'contact@company.com',
              address: '123 Company St'
            },
            images: ['/placeholder.svg'], // Legacy field
            imageUrls: ['/placeholder.svg'], // New field
            displayImage: '/placeholder.svg',
            discount: 0,
            discountValidUntil: null,
            averageRating: 4.5,
            totalRatings: 100,
            version: 1,
            interactions: {
              likes: 0,
              shares: 0,
              comments: [],
              userHasLiked: false,
              userHasShared: false
            },
            // Legacy compatibility properties
            brand: 'Brand',
            colors: [],
            subcategory: 'chairs',
            featured: false,
            bestSeller: false,
            new: false
          },
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.color ? { name: item.color, code: '#000000' } : undefined
        })),
        createdAt: new Date(apiOrder.created_at),
        updatedAt: apiOrder.created_at ? new Date(apiOrder.created_at) : undefined
      }));
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orders = await this.getUserOrders();
      return orders.find(order => order.id === orderId) || null;
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
      const apiOrderData = {
        buyer_id: orderData.buyerId,
        total_amount: orderData.totalAmount,
        shipping_address: `${orderData.receiverName}, ${orderData.receiverPhone}`,
        status: orderData.status,
        items: orderData.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.selectedColor?.name
        }))
      };

      const response = await ordersApi.createOrder(apiOrderData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.data) {
        throw new Error('No order data returned');
      }
      
      return {
        ...orderData,
        id: response.data.id,
        createdAt: new Date(response.data.created_at)
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}
