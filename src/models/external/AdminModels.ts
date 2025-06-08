
// External models for Admin API responses
export interface ExternalCompanyResponse {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  taxId?: string;
  status: 'pending' | 'verified' | 'rejected';
  kycDocuments?: string[];
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ExternalUserResponse {
  _id: string;
  email: string;
  fullname: string;
  phone?: string;
  role: string[];
  companyId: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ExternalOrderResponse {
  _id: string;
  user_id: string;
  company_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
  shipping_address: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ExternalProductVerificationResponse {
  _id: string;
  product_id: string;
  company_id: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  __v: number;
}

export interface ExternalCategoryResponse {
  _id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ExternalKycVerificationResponse {
  _id: string;
  company_id: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  comments?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  __v: number;
}
