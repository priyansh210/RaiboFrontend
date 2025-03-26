
import { supabase } from '../integrations/supabase/client';
import { Product, Color } from '../data/products';

export interface DatabaseProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  is_featured: boolean;
  seller_id: string;
  delivery_info: string | null;
  dimensions: string | null;
  materials: string | null;
  created_at: string;
  updated_at: string;
  product_images: {
    id: string;
    image_url: string;
    is_primary: boolean;
  }[];
  product_colors: {
    id: string;
    name: string;
    code: string;
  }[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Fetch products with their related images and colors
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_colors (*)
      `);
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    // Transform the data to match the Product interface
    return (data as DatabaseProduct[]).map(dbProduct => {
      // Extract images
      const images = dbProduct.product_images.map(img => img.image_url);
      
      // Extract colors
      const colors: Color[] = dbProduct.product_colors.map(color => ({
        name: color.name,
        code: color.code
      }));
      
      // Convert the database product to the Product interface
      return {
        id: dbProduct.id,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: Number(dbProduct.price), // Ensure price is a number
        description: dbProduct.description,
        category: dbProduct.category,
        subcategory: '', // Set a default subcategory
        images: images.length > 0 ? images : ['/placeholder.svg'],
        colors: colors.length > 0 ? colors : [{ name: 'Default', code: '#CCCCCC' }],
        material: dbProduct.materials || '',
        dimensions: {
          width: 0,
          height: 0,
          depth: 0,
          unit: 'cm'
        },
        weight: {
          value: 0,
          unit: 'kg'
        },
        ratings: {
          average: 4.5,
          count: 0
        },
        stock: dbProduct.stock,
        featured: dbProduct.is_featured,
        bestSeller: false,
        new: false,
        deliveryInfo: dbProduct.delivery_info || 'Standard Delivery',
        additionalInfo: []
      };
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_colors (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
    
    const dbProduct = data as DatabaseProduct;
    
    // Extract images
    const images = dbProduct.product_images.map(img => img.image_url);
    
    // Extract colors
    const colors: Color[] = dbProduct.product_colors.map(color => ({
      name: color.name,
      code: color.code
    }));
    
    // Convert the database product to the Product interface
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      brand: dbProduct.brand,
      price: Number(dbProduct.price),
      description: dbProduct.description,
      category: dbProduct.category,
      subcategory: '',
      images: images.length > 0 ? images : ['/placeholder.svg'],
      colors: colors.length > 0 ? colors : [{ name: 'Default', code: '#CCCCCC' }],
      material: dbProduct.materials || '',
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: 'cm'
      },
      weight: {
        value: 0,
        unit: 'kg'
      },
      ratings: {
        average: 4.5,
        count: 0
      },
      stock: dbProduct.stock,
      featured: dbProduct.is_featured,
      bestSeller: false,
      new: false,
      deliveryInfo: dbProduct.delivery_info || 'Standard Delivery',
      additionalInfo: []
    };
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    return undefined;
  }
};

export const getSimilarProducts = async (product: Product, limit: number = 4): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_colors (*)
      `)
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(limit);
    
    if (error) {
      console.error('Error fetching similar products:', error);
      throw error;
    }
    
    // Transform the data to match the Product interface
    return (data as DatabaseProduct[]).map(dbProduct => {
      // Extract images
      const images = dbProduct.product_images.map(img => img.image_url);
      
      // Extract colors
      const colors: Color[] = dbProduct.product_colors.map(color => ({
        name: color.name,
        code: color.code
      }));
      
      // Convert the database product to the Product interface
      return {
        id: dbProduct.id,
        name: dbProduct.name,
        brand: dbProduct.brand,
        price: Number(dbProduct.price),
        description: dbProduct.description,
        category: dbProduct.category,
        subcategory: '',
        images: images.length > 0 ? images : ['/placeholder.svg'],
        colors: colors.length > 0 ? colors : [{ name: 'Default', code: '#CCCCCC' }],
        material: dbProduct.materials || '',
        dimensions: {
          width: 0,
          height: 0,
          depth: 0,
          unit: 'cm'
        },
        weight: {
          value: 0,
          unit: 'kg'
        },
        ratings: {
          average: 4.5,
          count: 0
        },
        stock: dbProduct.stock,
        featured: dbProduct.is_featured,
        bestSeller: false,
        new: false,
        deliveryInfo: dbProduct.delivery_info || 'Standard Delivery',
        additionalInfo: []
      };
    });
  } catch (error) {
    console.error('Failed to fetch similar products:', error);
    return [];
  }
};
