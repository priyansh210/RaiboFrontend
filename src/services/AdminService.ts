import { apiService } from './ApiService';
import { AdminMapper } from '../mappers/AdminMapper';
import { 
  AdminCompany, 
  AdminUser, 
  AdminOrder,
  ProductVerification,
  KycVerification,
  AdminCategory,
  AdminDashboardStats
} from '../models/internal/Admin';
import { ProductComment, ProductVerificationStatus } from '../models/internal/ProductComments';
import { Product } from '../models/internal/Product';
import { 
  ExternalCompanyResponse,
  ExternalUserResponse,
  ExternalOrderResponse,
  ExternalProductVerificationResponse,
  ExternalKycVerificationResponse,
  ExternalCategoryResponse
} from '../models/external/AdminModels';
import { ExternalProductResponse } from '@/models/external/ProductModels';
import { ProductMapper } from '@/mappers/ProductMapper';

class AdminService {
  // Dashboard Stats
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const response = await apiService.request<AdminDashboardStats>('/api/v1/admin/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }

  // Company Management
  async getAllCompanies(): Promise<AdminCompany[]> {
    try {
      const response = await apiService.request<{ companies: ExternalCompanyResponse[] }>('/api/v1/admin/companies');
      return response.companies.map(AdminMapper.mapExternalCompanyToInternal);
    } catch (error) {
      console.error('Failed to get companies:', error);
      throw new Error('Failed to get companies');
    }
  }

  async getCompanyById(companyId: string): Promise<AdminCompany> {
    try {
      const response = await apiService.request<{ company: ExternalCompanyResponse }>(`/api/v1/admin/companies/${companyId}`);
      return AdminMapper.mapExternalCompanyToInternal(response.company);
    } catch (error) {
      console.error('Failed to get company:', error);
      throw new Error('Failed to get company');
    }
  }

  async updateCompanyStatus(companyId: string, status: 'pending' | 'verified' | 'rejected', comments?: string): Promise<void> {
    try {
      await apiService.request(`/api/v1/admin/companies/${companyId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, comments }),
      });
    } catch (error) {
      console.error('Failed to update company status:', error);
      throw new Error('Failed to update company status');
    }
  }

  // User Management
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response = await apiService.request<{ users: ExternalUserResponse[] }>('/api/v1/admin/users');
      return response.users.map(AdminMapper.mapExternalUserToInternal);
    } catch (error) {
      console.error('Failed to get users:', error);
      throw new Error('Failed to get users');
    }
  }

  async getUserById(userId: string): Promise<AdminUser> {
    try {
      const response = await apiService.request<{ user: ExternalUserResponse }>(`/api/v1/admin/users/${userId}`);
      return AdminMapper.mapExternalUserToInternal(response.user);
    } catch (error) {
      console.error('Failed to get user:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    try {
      await apiService.request(`/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw new Error('Failed to update user status');
    }
  }

  // Order Management
  async getAllOrders(): Promise<AdminOrder[]> {
    try {
      const response = await apiService.request<{ orders: ExternalOrderResponse[] }>('/api/v1/admin/orders');
      return response.orders.map(AdminMapper.mapExternalOrderToInternal);
    } catch (error) {
      console.error('Failed to get orders:', error);
      throw new Error('Failed to get orders');
    }
  }

  async getOrderById(orderId: string): Promise<AdminOrder> {
    try {
      const response = await apiService.request<{ order: ExternalOrderResponse }>(`/api/v1/admin/orders/${orderId}`);
      return AdminMapper.mapExternalOrderToInternal(response.order);
    } catch (error) {
      console.error('Failed to get order:', error);
      throw new Error('Failed to get order');
    }
  }

  // Product Verification
  async getPendingProductVerifications(): Promise<ProductVerification[]> {
    try {
      const response = await apiService.getAllPendingProducts() as { products: ExternalProductResponse[] };
      return AdminMapper.mapExternalProductToVerificationToInternalArray(response.products);
    } catch (error) {
      console.error('Failed to get pending product verifications:', error);
      throw new Error('Failed to get pending product verifications');
    }
  }

  async getProductForPreview(productId: string): Promise<Product> {
    try {
      const response = await apiService.getProductById(productId);
      return ProductMapper.mapExternalToProduct(response as ExternalProductResponse);
    } catch (error) {
      console.error('Failed to get product for preview:', error);
      throw new Error('Failed to get product for preview');
    }
  }

  async getProductComments(productId: string): Promise<ProductComment[]> {
    try {
      // Using the existing comment API, filtering for internal comments
      const response = await apiService.request<{ comments: any[] }>(`/api/v1/products/${productId}/comments?type=internal`);
      
      return response.comments.map(comment => ({
        id: comment._id,
        productId: productId,
        userId: comment.user_id || 'admin',
        userRole: comment.type === 'internal' ? 'admin' : 'seller',
        userName: comment.user_name || 'Admin',
        content: comment.content,
        commentType: comment.comment_type || 'feedback',
        parentCommentId: comment.parentComment,
        status: comment.status || 'active',
        createdAt: new Date(comment.created_at || Date.now()),
        updatedAt: new Date(comment.updated_at || Date.now()),
      }));
    } catch (error) {
      console.error('Failed to get product comments:', error);
      return [];
    }
  }

  async addProductComment(productId: string, content: string, commentType: string = 'feedback', parentId?: string): Promise<ProductComment> {
    try {
      const response = await apiService.addComment(productId, content, 'Product', 'internal');
      
      return {
        id: response._id || Date.now().toString(),
        productId: productId,
        userId: 'admin',
        userRole: 'admin',
        userName: 'Admin',
        content: content,
        commentType: commentType as any,
        parentCommentId: parentId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Failed to add product comment:', error);
      throw new Error('Failed to add product comment');
    }
  }

  async replyToProductComment(parentCommentId: string, content: string): Promise<ProductComment> {
    try {
      const response = await apiService.replyToComment(parentCommentId, content);
      
      return {
        id: response._id || Date.now().toString(),
        productId: response.productId || '',
        userId: 'admin',
        userRole: 'admin',
        userName: 'Admin',
        content: content,
        commentType: 'response',
        parentCommentId: parentCommentId,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      throw new Error('Failed to reply to comment');
    }
  }

  async verifyProduct(product_id: string, status: 'approved' | 'rejected'): Promise<void> {
    try {
      if(status === 'rejected') {
        await apiService.rejectProductByAdmin(product_id)
      }
      else{
        await apiService.approveProductByAdmin(product_id);
      }
    } catch (error) {
      console.error('Failed to verify product:', error);
      throw new Error('Failed to verify product');
    }
  }

  async updateProductVerificationStatus(productId: string, status: 'approved' | 'rejected' | 'needs_revision', comments?: string): Promise<void> {
    try {
      if (status === 'approved') {
        await apiService.approveProductByAdmin(productId);
      } else {
        await apiService.rejectProductByAdmin(productId, comments);
      }
      
      // Add admin comment if provided
      if (comments) {
        await this.addProductComment(productId, comments, 'feedback');
      }
    } catch (error) {
      console.error('Failed to update product verification status:', error);
      throw new Error('Failed to update product verification status');
    }
  }

  // KYC Verification
  async getPendingKycVerifications(): Promise<KycVerification[]> {
    try {
      return [this.getDummyKycVerification()];
    } catch (error) {
      console.error('Failed to get pending KYC verifications:', error);
      throw new Error('Failed to get pending KYC verifications');
    }
  }

  // Dummy KYC Verification object for testing or placeholder purposes
  getDummyKycVerification(): KycVerification {
    return {
      id: 'dummy-kyc-id',
      companyId: 'dummy-company-id',
      status: 'pending',
      documents: ['doc1.pdf', 'doc2.pdf'],
      comments: 'Awaiting review',
      reviewedBy: undefined,
      reviewedAt: undefined,
      createdAt: new Date(),
    };
  }

  async verifyKyc(verificationId: string, status: 'approved' | 'rejected', comments?: string): Promise<void> {
    try {
      await apiService.request(`/api/v1/admin/kyc-verifications/${verificationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, comments }),
      });
    } catch (error) {
      console.error('Failed to verify KYC:', error);
      throw new Error('Failed to verify KYC');
    }
  }

  async addComment(referenceId: string, comment: string, onModel: 'Product' | 'KYC' = 'Product'): Promise<any> {
    try {
      return await apiService.addComment(referenceId, comment, onModel, 'internal');
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw new Error('Failed to add comment');
    }
  }

  async replyToComment(parentCommentId: string, reply: string): Promise<any> {
    try {
      return await apiService.replyToComment(parentCommentId, reply);
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      throw new Error('Failed to reply to comment');
    }
  }
  // Category Management
  async getAllCategories(): Promise<AdminCategory[]> {
    try {
      const response = await apiService.request<{ categories: ExternalCategoryResponse[] }>('/api/v1/admin/categories');
      return response.categories.map(AdminMapper.mapExternalCategoryToInternal);
    } catch (error) {
      console.error('Failed to get categories:', error);
      throw new Error('Failed to get categories');
    }
  }

  async createCategory(categoryData: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<AdminCategory> {
    try {
      const response = await apiService.request<{ category: ExternalCategoryResponse }>('/api/v1/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
      return AdminMapper.mapExternalCategoryToInternal(response.category);
    } catch (error) {
      console.error('Failed to create category:', error);
      throw new Error('Failed to create category');
    }
  }

  async updateCategory(categoryId: string, categoryData: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<AdminCategory> {
    try {
      const response = await apiService.request<{ category: ExternalCategoryResponse }>(`/api/v1/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
      return AdminMapper.mapExternalCategoryToInternal(response.category);
    } catch (error) {
      console.error('Failed to update category:', error);
      throw new Error('Failed to update category');
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
      await apiService.request(`/api/v1/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw new Error('Failed to delete category');
    }
  }
}

export const adminService = new AdminService();
