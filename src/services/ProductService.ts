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

export const getSimilarProducts = async (product: Product, limit: number = 4): Promise<Product[]> => {
  try {
    const allProducts = await fetchProducts();
    const similarProducts = allProducts
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
    
    return similarProducts;
  } catch (error) {
    console.error('Failed to fetch similar products:', error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await apiService.searchProducts(query);
    
    if (!response || !Array.isArray(response)) {
      console.error('Invalid search response:', response);
      return [];
    }
    
    return ProductMapper.mapProductsArrayFromExternal(response as ExternalProductResponse[]);
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};

// export const likeProduct = async (productId: string): Promise<void> => {
//   try {
//     await apiService.request(`${apiService.getEndpoint('PRODUCTS', 'LIKE')}/${productId}`, {
//       method: 'POST',
//     });
//   } catch (error) {
//     console.error('Failed to like product:', error);
//     throw error;
//   }
// };

// export const unlikeProduct = async (productId: string): Promise<void> => {
//   try {
//     await apiService.request(`${apiService.getEndpoint('PRODUCTS', 'UNLIKE')}/${productId}`, {
//       method: 'POST',
//     });
//   } catch (error) {
//     console.error('Failed to unlike product:', error);
//     throw error;
//   }
// };

export const addComment = async (productId: string, comment: string): Promise<any> => {
  try {
    const response = await apiService.request(`${apiService.getEndpoint('PRODUCTS', 'COMMENT')}/${productId}`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
    return response;
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
};

export const replyToComment = async (commentId: string, reply: string): Promise<any> => {
  try {
    const response = await apiService.request(`${apiService.getEndpoint('PRODUCTS', 'REPLY')}/${commentId}`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    });
    return response;
  } catch (error) {
    console.error('Failed to reply to comment:', error);
    throw error;
  }
};
