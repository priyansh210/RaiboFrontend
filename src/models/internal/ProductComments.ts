
export interface ProductComment {
  id: string;
  productId: string;
  userId: string;
  userRole: 'admin' | 'seller';
  userName: string;
  content: string;
  commentType: 'feedback' | 'response' | 'general';
  parentCommentId?: string;
  status: 'active' | 'resolved' | 'addressed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentThread {
  id: string;
  productId: string;
  comments: ProductComment[];
  status: 'open' | 'resolved';
  lastActivity: Date;
}

export interface ProductVerificationStatus {
  id: string;
  productId: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  adminComments: ProductComment[];
  sellerResponses: ProductComment[];
  submissionDate: Date;
  lastReviewDate?: Date;
  reviewedBy?: string;
}
