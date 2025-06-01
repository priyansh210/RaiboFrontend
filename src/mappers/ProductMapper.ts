
// Mappers for converting between external and internal product models
import { ExternalProductResponse, ExternalCategoryResponse } from '../models/external/ProductModels';
import { Product, ProductCategory } from '../models/internal/Product';

export class ProductMapper {
  static mapExternalToProduct(external: ExternalProductResponse): Product {
    return {
      id: external.id,
      name: external.name,
      brand: external.brand,
      price: external.price,
      description: external.description,
      category: external.category,
      subcategory: external.subcategory || '',
      images: external.images,
      colors: external.colors,
      material: external.material,
      dimensions: external.dimensions,
      weight: external.weight,
      ratings: external.ratings,
      stock: external.stock,
      featured: external.featured,
      bestSeller: external.bestSeller || false,
      new: external.new || false,
      deliveryInfo: external.deliveryInfo,
      additionalInfo: external.additionalInfo || [],
      sellerId: external.seller_id,
      createdAt: external.created_at ? new Date(external.created_at) : undefined,
      updatedAt: external.updated_at ? new Date(external.updated_at) : undefined,
    };
  }

  static mapExternalToCategory(external: ExternalCategoryResponse): ProductCategory {
    return {
      id: external.id,
      name: external.name,
      description: external.description,
      image: external.image,
      parentId: external.parent_id,
      createdAt: external.created_at ? new Date(external.created_at) : undefined,
    };
  }

  static mapProductsArrayFromExternal(externals: ExternalProductResponse[]): Product[] {
    return externals.map(external => this.mapExternalToProduct(external));
  }
}
