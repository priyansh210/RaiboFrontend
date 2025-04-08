
import { products, brands, categories } from '../data/products';
import { ApiProduct, AuthUser, Order } from './types';

// Mock users for authentication
export const mockUsers = [
  {
    id: '1',
    email: 'buyer@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['buyer']
  },
  {
    id: '2',
    email: 'seller@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    roles: ['seller']
  },
  {
    id: '3',
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['buyer', 'seller', 'admin']
  }
];

// Convert products to ApiProduct structure
export const mockProducts: ApiProduct[] = products.map(product => ({
  ...product,
  seller_id: '2'  // Assign all products to the seller account
}));

// Mock orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    buyer_id: '1',
    total_amount: 1297,
    shipping_address: '123 Main St, Anytown, USA',
    status: 'delivered',
    created_at: '2023-09-15T10:30:00Z',
    items: [
      {
        product_id: '001',
        quantity: 2,
        price: 599,
        color: 'Gray'
      },
      {
        product_id: '004',
        quantity: 1,
        price: 129,
        color: 'Terracotta'
      }
    ]
  },
  {
    id: 'order-2',
    buyer_id: '1',
    total_amount: 849,
    shipping_address: '123 Main St, Anytown, USA',
    status: 'shipped',
    created_at: '2023-10-20T14:45:00Z',
    items: [
      {
        product_id: '003',
        quantity: 1,
        price: 849,
        color: 'Brown'
      }
    ]
  }
];

// Export categories and brands from the product data
export { categories, brands };
