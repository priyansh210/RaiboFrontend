// ExternalOrderResponse.ts
// Model for the order as returned by the backend API

export interface ExternalOrderItemResponse {
  product_id: string;
  quantity: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface ExternalOrderResponse {
  _id: string;
  user_id: string;
  cart_id: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  payment_method: 'credit_card' | 'debit_card' | 'cash_on_delivery';
  method_id?: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_date?: string;
  orderItems: ExternalOrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}
