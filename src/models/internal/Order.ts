// Internal Order model
export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: ProductColor;
  itemStatus?: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Order {
  id: string;
  buyerId: string;
  cartId: string;
  addressId: string;
  paymentMethod: string;
  receiverName: string;
  receiverPhone: string;
  methodId: string;
  deliveryDate: Date;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: Date;
  updatedAt?: Date;
}

export const OrderStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

import { Product, ProductColor } from './Product';
