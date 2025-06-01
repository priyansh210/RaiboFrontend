
// Internal Product model
export interface ProductColor {
  name: string;
  code: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

export interface ProductWeight {
  value: number;
  unit: string;
}

export interface ProductRatings {
  average: number;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  images: string[];
  colors: ProductColor[];
  material: string;
  dimensions: ProductDimensions;
  weight: ProductWeight;
  ratings: ProductRatings;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  new: boolean;
  deliveryInfo: string;
  additionalInfo: string[];
  sellerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt?: Date;
}
