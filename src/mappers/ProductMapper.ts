import { ExternalProductResponse } from '../models/external/ProductModels';
import { Product } from '../models/internal/Product';

export class ProductMapper {
  static mapExternalToProduct(external: ExternalProductResponse): Product {
    if (!external || !external._id || !external.name || !external.category_id || !external.company_id) {
      throw new Error('Invalid external product response');
    }

    return {
      id: external._id,
      name: external.name,
      description: external.description || '',
      price: external.price || 0,
      quantity: external.quantity || 0,
      category: {
        id: external.category_id._id,
        name: external.category_id.name,
      },
      company: {
        id: external.company_id._id,
        name: external.company_id.name,
        email: external.company_id.email,
        address: external.company_id.address,
      },
      images: external.images || [],
      discount: external.discount || 0,
      discountValidUntil: external.discount_valid_until ? new Date(external.discount_valid_until) : null,
      averageRating: external.average_rating || 0,
      totalRatings: external.total_ratings || 0,
      version: external.__v || 0,
      interactions: this.generateDefaultInteractions(external._id),
      userPreferences: this.generateDefaultUserPreferences(),
    };
  }

  static mapProductsArrayFromExternal(externals: ExternalProductResponse[]): Product[] {
    return externals.map(external => this.mapExternalToProduct(external));
  }

  private static generateDefaultInteractions(productId: string) {
    return {
      likes: 0,
      shares: 0,
      comments: [],
      userHasLiked: false,
      userHasShared: false,
    };
  }

  private static generateDefaultUserPreferences() {
    return {
      preferredColors: [{ name: 'Default', code: '#000000' }],
      preferredQuantity: 1,
    };
  }
}