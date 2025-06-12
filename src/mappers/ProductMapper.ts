
import { boolean } from 'zod';
import { ExternalProductResponse } from '../models/external/ProductModels';
import { Product } from '../models/internal/Product';

export class ProductMapper {
  static mapExternalToProduct(external: ExternalProductResponse): Product {
    if (!external || !external._id || !external.name || !external.company_id) {
      throw new Error('Invalid external product response');
    }

    const imageUrls = external.imageUrls || [];
    const displayImage = imageUrls.length > 0 ? imageUrls[0] : '';

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
      images: external.imageUrls || [], // Legacy field
      imageUrls, // New field for storing image URLs
      displayImage, // First image from imageUrls
      discount: external.discount || 0,
      discountValidUntil: external.discount_valid_until ? new Date(external.discount_valid_until) : null,
      averageRating: external.average_rating || 0,
      totalRatings: external.total_ratings || 0,
      version: external.__v || 0,
      interactions: this.generateInteractions(external.isLikedByUser, external.likesCount),
      userPreferences: this.generateDefaultUserPreferences(),
      // Add dummy values for display properties
      featured: Math.random() > 0.8, // 20% chance of being featured
      new: Math.random() > 0.7, // 30% chance of being new
      bestSeller: Math.random() > 0.8, // 20% chance of being bestseller
      // Legacy compatibility
      brand: external.company_id.name,
      colors: this.generateDefaultUserPreferences().preferredColors,
      subcategory: external.category_id.name,
    };
  }

  static mapProductsArrayFromExternal(externals: ExternalProductResponse[]): Product[] {
    return externals.map(external => this.mapExternalToProduct(external));
  }

  private static generateInteractions(userHasLiked: boolean = false, likesCount : number = 0) {
    return {
      likes: likesCount,
      shares: Math.floor(Math.random() * 100) + 5,
      comments: [],
      userHasLiked: userHasLiked,
      userHasShared: false,
    };
  }

  private static generateDefaultUserPreferences() {
    const colors = [
      { name: 'Natural', code: '#F5E6D3' },
      { name: 'Charcoal', code: '#2C2C2C' },
      { name: 'White', code: '#FFFFFF' },
      { name: 'Brown', code: '#8B4513' },
    ];
    
    return {
      preferredColors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
      preferredQuantity: 1,
    };
  }
}
