
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import ProductPreview from '@/components/ProductPreview';
import CommentSystem from '@/components/CommentSystem';
import { apiService } from '@/services/ApiService';
import { adminService } from '@/services/AdminService';
import { Product } from '@/models/internal/Product';
import { ProductComment } from '@/models/internal/ProductComments';
import { ProductMapper } from '@/mappers/ProductMapper';
import { ExternalProductResponse } from '@/models/external/ProductModels';

const SellerProductPreview: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resubmitDialog, setResubmitDialog] = useState(false);
  const [resubmitMessage, setResubmitMessage] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProductAndComments();
    }
  }, [productId]);

  const fetchProductAndComments = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      // Get product data using apiService
      const productResponse = await apiService.getProductById(productId);
      const productData = ProductMapper.mapExternalToProduct(productResponse as ExternalProductResponse);
      
      // Get comments using adminService (reusing the API)
      const commentsData = await adminService.getProductComments(productId);
      
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

  const handleAddComment = async (content: string, commentType?: string, parentId?: string) => {
    if (!productId) return;
    
    try {
      if (parentId) {
        await apiService.replyToComment(parentId, content);
      } else {
        await apiService.addComment(productId, content, 'Product', 'external');
      }
      
      // Refresh comments
      await fetchProductAndComments();
      
      toast({
        title: "Success",
        description: "Response added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add response",
        variant: "destructive",
      });
    }
  };

  const handleResubmit = async () => {
    if (!productId) return;
    
    try {
      // Add seller's resubmission message as a comment
      if (resubmitMessage.trim()) {
        await apiService.addComment(productId, `Resubmission: ${resubmitMessage}`, 'Product', 'external');
      }
      
      // In a real implementation, this would trigger a resubmission workflow
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Product resubmitted for review",
      });
      
      setResubmitDialog(false);
      setResubmitMessage('');
      navigate('/seller/products');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resubmit product",
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
              onClick={() => navigate('/seller/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Product Preview</h1>
              <p className="text-sm text-gray-600">Preview how your product appears to customers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Seller Preview Mode</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Product Preview */}
          <div className="xl:col-span-2">
            <ProductPreview
              product={product}
              userRole="seller"
              isPreview={true}
              onAddComment={() => {/* Handled by comment system */}}
              onResubmit={() => setResubmitDialog(true)}
            />
          </div>

          {/* Comment System */}
          <div className="xl:col-span-1">
            <CommentSystem
              productId={productId!}
              comments={comments}
              userRole="seller"
              onAddComment={handleAddComment}
            />
          </div>
        </div>
      </div>

      {/* Resubmit Dialog */}
      <Dialog open={resubmitDialog} onOpenChange={setResubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resubmit Product for Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Explain what changes you've made to address the admin's feedback:
            </p>
            <Textarea
              placeholder="Describe the changes made to your product..."
              value={resubmitMessage}
              onChange={(e) => setResubmitMessage(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleResubmit}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Resubmit for Review
              </Button>
              <Button
                onClick={() => setResubmitDialog(false)}
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

export default SellerProductPreview;
