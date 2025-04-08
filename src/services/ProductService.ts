
import { ApiProduct } from '../api/types';
import { productsApi } from '../api/mockApi';
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
    const response = await productsApi.getProducts();
    
    if (response.error) {
      console.error('Error fetching products:', response.error);
      return [];
    }
    
    return (response.data || []).map(apiProductToProduct);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const response = await productsApi.getProductById(id);
    
    if (response.error || !response.data) {
      console.error('Error fetching product by ID:', response.error);
      return undefined;
    }
    
    return apiProductToProduct(response.data);
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    return undefined;
  }
};

export const getSimilarProducts = async (product: Product, limit: number = 4): Promise<Product[]> => {
  try {
    const response = await productsApi.getSimilarProducts(product.id, limit);
    
    if (response.error) {
      console.error('Error fetching similar products:', response.error);
      return [];
    }
    
    return (response.data || []).map(apiProductToProduct);
  } catch (error) {
    console.error('Failed to fetch similar products:', error);
    return [];
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await productsApi.searchProducts(query);
    
    if (response.error) {
      console.error('Error searching products:', response.error);
      return [];
    }
    
    return (response.data || []).map(apiProductToProduct);
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
};
