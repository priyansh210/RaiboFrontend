import { Product, ProductDetailSeller } from '../models/internal/Product';
import { ExternalProductDetailSellerResponse, ExternalProductResponse } from '../models/external/ProductModels';
import { ProductMapper } from '../mappers/ProductMapper';
import { apiService } from './ApiService';

class ProductService {
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await apiService.getAllProducts();
      
      if (!response || !Array.isArray(response)) {
        console.error('Invalid products response:', response);
        return [];
      }
      return ProductMapper.mapProductsArrayFromExternal(response as ExternalProductResponse[]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const response = await apiService.getProductById(id);
      
      if (!response) {
        console.error('Product not found:', id);
        return undefined;
      }
      
      return ProductMapper.mapExternalToProduct(response as ExternalProductResponse);
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return undefined;
    }
  }

  async getSellerProductDetailsById(id: string): Promise<ProductDetailSeller | undefined> {
    try {
      const response = await apiService.getSellerProductById(id);
      
      if (!response) {
        console.error('Product not found:', id);
        return undefined;
      }
      
      return ProductMapper.mapExternalProductDetailSellerToInternal(response as ExternalProductDetailSellerResponse);
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return undefined;
    }
  }

  async getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
    try {
      const allProducts = await this.fetchProducts();
      const similarProducts = allProducts
        .slice(0, limit);
      return similarProducts;
    } catch (error) {
      console.error('Failed to fetch similar products:', error);
      return [];
    }
  }

  async searchProducts(query?: string, imageFile?: File): Promise<Product[]> {
    try {
      const response = await apiService.searchProducts(query, imageFile) as {products: ExternalProductResponse[]};
      if (!response || !Array.isArray(response.products)) {
        console.error('Invalid search response:', response);
        return [];
      }

      return ProductMapper.mapProductsArrayFromExternal(response.products as ExternalProductResponse[]);
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }

  // Unified text+image search
  async searchProductsByTextAndImage(query?: string, imageFile?: File): Promise<Product[]> {
    return this.searchProducts(query, imageFile);
  }

  async likeProduct(productId: string): Promise<void> {
    try {
      await apiService.handleLike(productId);
    } catch (error) {
      console.error('Failed to like product:', error);
      throw error;
    }
  }

  async addComment(productId: string, comment: string): Promise<any> {
    try {
      const response = await apiService.addComment(productId, comment);
      return response;
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  }

  async replyToComment(commentId: string, reply: string): Promise<any> {
    try {
      const response = await apiService.replyToComment(commentId, reply);
      return response;
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();

