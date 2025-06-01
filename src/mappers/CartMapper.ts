
// Mappers for converting between external and internal cart models
import { ExternalCartResponse, ExternalCartItemResponse } from '../models/external/CartModels';
import { Cart, CartItem } from '../models/internal/Cart';
import { ProductMapper } from './ProductMapper';

export class CartMapper {
  static mapExternalToCartItem(external: ExternalCartItemResponse): CartItem {
    return {
      id: external.id,
      productId: external.product_id,
      product: external.product ? ProductMapper.mapExternalToProduct(external.product) : {} as any,
      quantity: external.quantity,
      price: external.price,
      selectedColor: external.color ? { name: external.color, code: external.color } : undefined,
      addedAt: external.created_at ? new Date(external.created_at) : undefined,
    };
  }

  static mapExternalToCart(external: ExternalCartResponse): Cart {
    const items = external.items.map(item => this.mapExternalToCartItem(item));
    
    return {
      id: external.id,
      buyerId: external.buyer_id,
      items,
      totalAmount: external.total_amount,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      createdAt: external.created_at ? new Date(external.created_at) : undefined,
      updatedAt: external.updated_at ? new Date(external.updated_at) : undefined,
    };
  }
}
