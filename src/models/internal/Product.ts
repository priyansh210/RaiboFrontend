
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
  // Additional properties for product filtering and display
  featured?: boolean;
  new?: boolean;
  bestSeller?: boolean;
  // Legacy compatibility properties
  brand?: string;
  colors?: ProductColor[];
  subcategory?: string;
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