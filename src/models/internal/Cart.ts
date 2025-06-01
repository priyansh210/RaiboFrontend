
// Internal Cart model
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: ProductColor;
  addedAt?: Date;
}

export interface Cart {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

import { Product, ProductColor } from './Product';
