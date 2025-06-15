
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Heart, Share2, MessageCircle } from 'lucide-react';
import { Product } from '@/models/internal/Product';

interface ProductPreviewProps {
  product: Product;
  userRole: 'admin' | 'seller' | 'buyer';
  isPreview?: boolean;
  onAddComment?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onResubmit?: () => void;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  userRole,
  isPreview = false,
  onAddComment,
  onApprove,
  onReject,
  onResubmit,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const renderActionButtons = () => {
    switch (userRole) {
      case 'admin':
        return (
          <div className="flex gap-2 mt-4">
            <Button onClick={onApprove} className="flex-1">
              Approve Product
            </Button>
            <Button onClick={onReject} variant="destructive" className="flex-1">
              Reject Product
            </Button>
            <Button onClick={onAddComment} variant="outline">
              Add Comment
            </Button>
          </div>
        );
      case 'seller':
        return (
          <div className="flex gap-2 mt-4">
            <Button onClick={onAddComment} variant="outline">
              Respond to Admin
            </Button>
            <Button onClick={onResubmit}>
              Resubmit for Review
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {isPreview && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            Preview Mode - This is how the product will appear to users
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-accent rounded-lg overflow-hidden">
            <img
              src={product.imageUrls[selectedImage] || product.displayImage || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 dark:bg-accent rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500 dark:border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">{product.name}</h1>
            <p className="text-gray-600 dark:text-muted-foreground mt-2">{product.company.name}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-medium">{product.averageRating}</span>
              <span className="text-gray-500 dark:text-muted-foreground">({product.totalRatings} reviews)</span>
            </div>
            <Badge variant="secondary">{product.category.name}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <Badge variant="destructive">-{product.discount}%</Badge>
              )}
            </div>
            <p className="text-green-600 font-medium">
              {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-border pt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Interactions Preview */}
          <div className="border-t border-gray-200 dark:border-border pt-4">
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{product.interactions.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{product.interactions.comments.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-4 w-4" />
                <span>{product.interactions.shares}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons for Admin/Seller */}
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
