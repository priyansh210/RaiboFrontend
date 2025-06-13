
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import ProductPreview from '@/components/ProductPreview';
import CommentSystem from '@/components/CommentSystem';
import { adminService } from '@/services/AdminService';
import { Product } from '@/models/internal/Product';
import { ProductComment } from '@/models/internal/ProductComments';

const AdminProductPreview: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectionDialog, setRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProductAndComments();
    }
  }, [productId]);

  const fetchProductAndComments = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      const [productData, commentsData] = await Promise.all([
        adminService.getProductForPreview(productId),
        adminService.getProductComments(productId),
      ]);
      
      setProduct(productData);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to fetch product data:', error);
      toast({
        title: "Error",
        description: "Failed to load product data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!productId) return;
    
    setIsApproving(true);
    try {
      await adminService.updateProductVerificationStatus(productId, 'approved');
      toast({
        title: "Success",
        description: "Product approved successfully",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve product",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!productId || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await adminService.updateProductVerificationStatus(productId, 'rejected', rejectionReason);
      toast({
        title: "Success",
        description: "Product rejected with feedback",
      });
      setRejectionDialog(false);
      setRejectionReason('');
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject product",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (content: string, commentType?: string, parentId?: string) => {
    if (!productId) return;
    
    try {
      if (parentId) {
        await adminService.replyToProductComment(parentId, content);
      } else {
        await adminService.addProductComment(productId, content, commentType || 'feedback');
      }
      
      // Refresh comments
      await fetchProductAndComments();
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading product preview...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Product Review</h1>
              <p className="text-sm text-gray-600">Review and provide feedback for: {product.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Admin Preview Mode</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Product Preview */}
          <div className="xl:col-span-2">
            <ProductPreview
              product={product}
              userRole="admin"
              isPreview={true}
              onApprove={handleApprove}
              onReject={() => setRejectionDialog(true)}
              onAddComment={() => {/* Handled by comment system */}}
            />
          </div>

          {/* Comment System */}
          <div className="xl:col-span-1">
            <CommentSystem
              productId={productId!}
              comments={comments}
              userRole="admin"
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialog} onOpenChange={setRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please provide detailed feedback on why this product is being rejected:
            </p>
            <Textarea
              placeholder="Explain what changes are needed for approval..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleReject}
                variant="destructive"
                className="flex-1"
                disabled={!rejectionReason.trim()}
              >
                Reject Product
              </Button>
              <Button
                onClick={() => setRejectionDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductPreview;
