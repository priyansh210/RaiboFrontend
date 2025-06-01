
// External models for API responses - Orders
export interface ExternalOrderItemResponse {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string;
  product?: ExternalProductResponse;
}

export interface ExternalOrderResponse {
  id: string;
  buyer_id: string;
  cart_id: string;
  address_id: string;
  payment_method: string;
  receiver_name: string;
  receiver_phone: string;
  method_id: string;
  delivery_date: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: ExternalOrderItemResponse[];
  created_at: string;
  updated_at?: string;
}

import { ExternalProductResponse } from './ProductModels';
