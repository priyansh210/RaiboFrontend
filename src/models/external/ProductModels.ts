export interface ExternalProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category_id: {
    _id: string;
    name: string;
    __v: number;
  };
  company_id: {
    _id: string;
    name: string;
    email: string;
    address: string;
    __v: number;
  };
  images: string[];
  imageUrls: string[];
  discount: number;
  discount_valid_until: string | null;
  average_rating: number;
  total_ratings: number;
  __v: number;
  status: string;
  likesCount: number;
  isLikedByUser: boolean;
  comments: {
    _id: string;
    content: string;
    parentComment?: string;
  }[];
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