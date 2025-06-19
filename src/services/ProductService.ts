
import { Product } from '../models/internal/Product';
import { ExternalProductResponse } from '../models/external/ProductModels';
import { ProductMapper } from '../mappers/ProductMapper';
import { apiService } from './ApiService';

export const fetchProducts = async (): Promise<Product[]> => {
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
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
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
};

export const getSimilarProducts = async (productId: string, limit: number = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    const similarProducts = allProducts
      .slice(0, limit);
    return similarProducts;
  } catch (error) {
    console.error('Failed to fetch similar products:', error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await apiService.getAllProducts();

    if (!response || !Array.isArray(response)) {
      console.error('Invalid search response:', response);
      return [];
    }

    const products = ProductMapper.mapProductsArrayFromExternal(response as ExternalProductResponse[]);
    const lowerQuery = query.toLowerCase();

    return products.filter(product => {
      return (
        product.name?.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery) ||
        product.category?.name.toLowerCase().includes(lowerQuery) ||
        product.company.name?.toLowerCase().includes(lowerQuery)
      );
    });
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};

export const likeProduct = async (productId: string): Promise<void> => {
  try {
    await apiService.handleLike(productId);
  } catch (error) {
    console.error('Failed to like product:', error);
    throw error;
  }
};

export const addComment = async (productId: string, comment: string): Promise<any> => {
  try {
    const response = await apiService.addComment(productId, comment);
    return response;
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};

export const replyToComment = async (commentId: string, reply: string): Promise<any> => {
  try {
    const response = await apiService.replyToComment(commentId, reply);
    return response;
  } catch (error) {
    console.error('Failed to reply to comment:', error);
    throw error;
  }
};
