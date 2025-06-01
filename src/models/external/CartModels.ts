
// External models for API responses - Cart
export interface ExternalCartItemResponse {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  color?: string;
  product?: ExternalProductResponse;
  created_at?: string;
  updated_at?: string;
}

export interface ExternalCartResponse {
  id: string;
  buyer_id: string;
  items: ExternalCartItemResponse[];
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

import { ExternalProductResponse } from './ProductModels';
