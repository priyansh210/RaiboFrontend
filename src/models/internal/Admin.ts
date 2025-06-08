
// Internal models for Admin functionality
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: string[];
  companyId: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCompany {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
  taxId?: string;
  status: 'pending' | 'verified' | 'rejected';
  kycDocuments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminOrder {
  id: string;
  userId: string;
  companyId: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVerification {
  id: string;
  productId: string;
  companyId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface KycVerification {
  id: string;
  companyId: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminDashboardStats {
  totalCompanies: number;
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  pendingProductVerifications: number;
  pendingKycVerifications: number;
  totalCategories: number;
}
