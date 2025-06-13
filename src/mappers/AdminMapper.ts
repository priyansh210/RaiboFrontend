
import { ExternalProductResponse } from '@/models/external/ProductModels';
import { 
  ExternalCompanyResponse, 
  ExternalUserResponse, 
  ExternalOrderResponse,
  ExternalProductVerificationResponse,
  ExternalKycVerificationResponse,
  ExternalCategoryResponse
} from '../models/external/AdminModels';
import { 
  AdminCompany, 
  AdminUser, 
  AdminOrder,
  ProductVerification,
  KycVerification,
  AdminCategory
} from '../models/internal/Admin';

export class AdminMapper {
  static mapExternalCompanyToInternal(external: ExternalCompanyResponse): AdminCompany {
    return {
      id: external._id,
      name: external.name,
      email: external.email,
      address: external.address,
      phone: external.phone,
      taxId: external.taxId,
      status: external.status,
      kycDocuments: external.kycDocuments,
      createdAt: new Date(external.created_at),
      updatedAt: new Date(external.updated_at),
    };
  }

  static mapExternalUserToInternal(external: ExternalUserResponse): AdminUser {
    return {
      id: external._id,
      email: external.email,
      fullName: external.fullname,
      phone: external.phone,
      roles: external.role,
      companyId: external.companyId,
      status: external.status,
      createdAt: new Date(external.created_at),
      updatedAt: new Date(external.updated_at),
    };
  }

  static mapExternalOrderToInternal(external: ExternalOrderResponse): AdminOrder {
    return {
      id: external._id,
      userId: external.user_id,
      companyId: external.company_id,
      totalAmount: external.total_amount,
      status: external.status,
      items: external.items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: external.shipping_address,
      createdAt: new Date(external.created_at),
      updatedAt: new Date(external.updated_at),
    };
  }

  static mapExternalProductVerificationToInternal(external: ExternalProductResponse): ProductVerification {
    return {
      id: external._id,
      productId: external._id,
      companyId: external.company_id._id,
      status: external.status,
      reviewedBy: undefined,
      reviewedAt: undefined,
      createdAt: new Date(),
    };
    }

    static mapExternalProductToVerificationToInternalArray(externals: ExternalProductResponse[]): ProductVerification[] {
    return externals.map(this.mapExternalProductVerificationToInternal);
    }

  static mapExternalKycVerificationToInternal(external: ExternalKycVerificationResponse): KycVerification {
    return {
      id: external._id,
      companyId: external.company_id,
      status: external.status,
      documents: external.documents,
      comments: external.comments,
      reviewedBy: external.reviewed_by,
      reviewedAt: external.reviewed_at ? new Date(external.reviewed_at) : undefined,
      createdAt: new Date(external.created_at),
    };
  }

  static mapExternalCategoryToInternal(external: ExternalCategoryResponse): AdminCategory {
    return {
      id: external._id,
      name: external.name,
      description: external.description,
      parentId: external.parent_id,
      createdAt: new Date(external.created_at),
      updatedAt: new Date(external.updated_at),
    };
  }
}
