
// External models for API responses - Products
export interface ExternalProductResponse {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  subcategory?: string;
  images: string[];
  colors: {
    name: string;
    code: string;
  }[];
  material: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  stock: number;
  featured: boolean;
  bestSeller?: boolean;
  new?: boolean;
  deliveryInfo: string;
  additionalInfo?: string[];
  seller_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ExternalProductsListResponse {
  products: ExternalProductResponse[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ExternalCategoryResponse {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent_id?: string;
  created_at?: string;
}
