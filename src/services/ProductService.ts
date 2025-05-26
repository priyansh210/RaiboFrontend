
import { ApiProduct } from '../api/types';
import { apiService } from './ApiService';
import { Product, Color } from '../data/products';

// Convert API product to frontend Product type
const apiProductToProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    brand: apiProduct.brand,
    price: apiProduct.price,
    description: apiProduct.description,
    category: apiProduct.category,
    subcategory: apiProduct.subcategory || '',
    images: apiProduct.images,
    colors: apiProduct.colors,
    material: apiProduct.material,
    dimensions: apiProduct.dimensions,
    weight: apiProduct.weight,
    ratings: apiProduct.ratings,
    stock: apiProduct.stock,
    featured: apiProduct.featured,
    bestSeller: apiProduct.bestSeller,
    new: apiProduct.new,
    deliveryInfo: apiProduct.deliveryInfo,
    additionalInfo: apiProduct.additionalInfo || []
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiService.getProducts();
    
    if (!response || !Array.isArray(response)) {
      console.error('Invalid products response:', response);
      return [];
    }
    
    return response.map(apiProductToProduct);
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
    
    return apiProductToProduct(response);
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    return undefined;
  }
};

export const getSimilarProducts = async (product: Product, limit: number = 4): Promise<Product[]> => {
  try {
    // For now, we'll fetch all products and filter by category
    // In a real implementation, the backend would have a dedicated endpoint
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
    
    return response.map(apiProductToProduct);
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};
