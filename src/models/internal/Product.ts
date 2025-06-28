export interface UserPreferences {
  preferredColors: ProductColor[]; // Array of preferred colors
  preferredQuantity: number; // Default quantity for the user
}

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

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  likes: number;
  userHasLiked: boolean;
}

export interface ProductInteraction {
  likes: number;
  shares: number;
  comments: ProductReview[];
  userHasLiked: boolean;
  userHasShared: boolean;
  views: number;
  orderCount: number; // Number of people who have ordered this item
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  images: string[]; // Legacy field for compatibility
  imageUrls: string[]; // New field for storing image URLs
  displayImage?: string; // First image from imageUrls for display purposes
  discount: number;
  discountValidUntil?: Date | null;
  averageRating: number;
  totalRatings: number;
  version: number;
  interactions: ProductInteraction;
  userPreferences?: UserPreferences;
  // Enhanced product information
  tags?: string[]; // Product tags for better categorization
  specifications?: Record<string, string>; // Product specifications
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount?: number; // Available stock count
  // Additional properties for product filtering and display
  featured?: boolean;
  new?: boolean;
  bestSeller?: boolean;
  trending?: boolean; // If the product is trending
  // Legacy compatibility properties
  brand?: string;
  colors?: ProductColor[];
  subcategory?: string;
  featureMap?: Record<string, string>;
  model3dUrl?: string; // URL to the 3D model for preview
}
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt?: Date;
}

export interface ProductSummary {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  companyName: string;
  tags?: string[];
  imageUrls: string[];
  isLikedByUser: boolean;
  likesCount: number;
  commentsCount: number;
}

export interface ProductDetailSeller {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
    email: string;
    address: string;
  };
  images: string[];
  imageUrls: string[];
  displayImage?: string;
  discount: number;
  discountValidUntil?: Date | null;
  averageRating: number;
  totalRatings: number;
  version: number;
  interactions: ProductInteraction;
  userPreferences?: UserPreferences;
  featured?: boolean;
  new?: boolean;
  bestSeller?: boolean;
  brand?: string;
  colors?: ProductColor[];
  subcategory?: string;
  // Seller-specific fields
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  salesCount: number;
  viewsCount: number;
  isActive: boolean;
  // New fields for 3D model and feature map
  model3dUrl?: string; // URL to the 3D model for preview
  featureMap?: Record<string, string>; // Map of feature name to value
  // Add more seller-specific fields as needed
}