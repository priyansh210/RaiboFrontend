import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Heart, Share2, MessageCircle, ShoppingCart, Home, ChevronLeft, ChevronRight, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '@/models/internal/Product';
import Product3DViewer from '@/components/Product3DViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import ProductInteractions from '@/components/ProductInteractions';

// Dummy data for preview mode
const dummyInteractions = {
  likes: 123,
  shares: 45,
  comments: [
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely stunning piece! The craftsmanship is exceptional and it fits perfectly in my living room.',
      createdAt: new Date('2024-01-15'),
      likes: 12,
      userHasLiked: false,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Michael Chen',
      rating: 4,
      comment: 'Great quality furniture. The material feels premium and sturdy. Only minor issue was a small scratch on arrival, but customer service handled it well.',
      createdAt: new Date('2024-01-10'),
      likes: 8,
      userHasLiked: true,
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Emily Rodriguez',
      rating: 5,
      comment: 'Love this purchase! It transformed my space completely. The color matches perfectly with my existing decor. Highly recommend!',
      createdAt: new Date('2024-01-05'),
      likes: 15,
      userHasLiked: false,
    },
  ],
  userHasLiked: false,
  userHasShared: false,
};

const dummySimilarProducts = [
  {
    id: 'sim1',
    name: 'Modern Oak Table',
    price: 299.99,
    images: ['/placeholder.svg'],
    company: { name: 'OakWorks' },
    averageRating: 4.7,
    totalRatings: 32,
    discount: 10,
    featureMap: {},
    quantity: 10,
    description: 'A beautiful oak table for modern homes.',
  },
  {
    id: 'sim2',
    name: 'Classic Walnut Chair',
    price: 149.99,
    images: ['/placeholder.svg'],
    company: { name: 'Walnut Co.' },
    averageRating: 4.5,
    totalRatings: 21,
    discount: 0,
    featureMap: {},
    quantity: 5,
    description: 'Elegant walnut chair with classic design.',
  },
];

const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    rating: 5,
    comment: 'Absolutely stunning piece! The craftsmanship is exceptional and it fits perfectly in my living room. The delivery was prompt and the assembly team was professional.',
    createdAt: new Date('2024-01-15'),
    likes: 12,
    userHasLiked: false,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Michael Chen',
    rating: 4,
    comment: 'Great quality furniture. The material feels premium and sturdy. Only minor issue was a small scratch on arrival, but customer service handled it well.',
    createdAt: new Date('2024-01-10'),
    likes: 8,
    userHasLiked: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Emily Rodriguez',
    rating: 5,
    comment: 'Love this purchase! It transformed my space completely. The color matches perfectly with my existing decor. Highly recommend!',
    createdAt: new Date('2024-01-05'),
    likes: 15,
    userHasLiked: false,
  },
];

const mockSimilarProducts = [
  {
    id: 'sim1',
    name: 'Modern Oak Table',
    images: ['/placeholder.svg'],
    price: 299,
    company: { name: 'OakWorks' },
    discount: 10,
  },
  {
    id: 'sim2',
    name: 'Classic Walnut Chair',
    images: ['/placeholder.svg'],
    price: 149,
    company: { name: 'WalnutCo' },
    discount: 0,
  },
  {
    id: 'sim3',
    name: 'Elegant Maple Desk',
    images: ['/placeholder.svg'],
    price: 399,
    company: { name: 'MapleMakers' },
    discount: 5,
  },
  {
    id: 'sim4',
    name: 'Minimalist Pine Shelf',
    images: ['/placeholder.svg'],
    price: 89,
    company: { name: 'PineDesigns' },
    discount: 0,
  },
];

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
  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || product.displayImage || '/placeholder.svg');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (product.images && currentImageIndex < product.images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(product.images[newIndex]);
    }
  };
  const prevImage = () => {
    if (product.images && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(product.images[newIndex]);
    }
  };

  // Use dummy data for preview
  const interactions = product.interactions || dummyInteractions;
  const reviews = interactions.comments;
  const similarProducts = dummySimilarProducts;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {isPreview && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            Preview Mode - This is how the product will appear to users
          </p>
        </div>
      )}
      {/* Top Section: Images + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Product Images and 3D Viewer */}
        <div className="space-y-4">
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images">Photos</TabsTrigger>
              <TabsTrigger value="3d">3D View</TabsTrigger>
            </TabsList>
            <TabsContent value="images" className="mt-4">
              <div className="aspect-square bg-card rounded-2xl overflow-hidden relative group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Image navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-card/80 hover:bg-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card/80 hover:bg-card p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={currentImageIndex === product.images.length - 1}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 mt-4">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(image);
                        setCurrentImageIndex(index);
                      }}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === image ? 'border-terracotta' : 'border-border'
                      }`}
                    >
                      <img src={image} alt={`${product.name} thumbnail ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="3d" className="mt-4">
              <Product3DViewer productName={product.name} url={(product as any).model3dUrl} />
            </TabsContent>
          </Tabs>
        </div>
        {/* Product Info */}
        <div className="flex flex-col">
          <div className="bg-card rounded-2xl p-6 md:p-8">
            <h1 className="font-playfair text-3xl md:text-4xl text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-lg mb-4">{product.company.name}</p>
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm ml-3">
                {product.averageRating?.toFixed(1) || '0.0'} ({product.totalRatings || 0} reviews)
              </span>
            </div>
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-foreground">${product.price}</span>
              {product.discount > 0 && (
                <span className="ml-3 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>
            {/* Dummy Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                className="flex-1 bg-terracotta text-white py-3 px-6 rounded-lg hover:bg-umber transition-colors flex items-center justify-center text-lg font-medium"
                type="button"
                disabled
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
              <button
                className="flex-1 border border-terracotta text-terracotta py-3 px-6 rounded-lg hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center text-lg font-medium"
                type="button"
                disabled
              >
                <Home size={20} className="mr-2" />
                Add to Room
              </button>
              <button
                className="flex-1 border border-terracotta text-terracotta py-3 px-6 rounded-lg hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center text-lg font-medium"
                type="button"
                disabled
              >
                <Heart size={20} className="mr-2" />
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Interactions (full width) */}
      <Card className="mb-12">
        <CardContent className="p-6">
          <ProductInteractions
            productId={product.id}
            interactions={product.interactions || { likes: 0, shares: 0, comments: [], userHasLiked: false, userHasShared: false }}
            ratings={{ average: product.averageRating, count: product.totalRatings }}
            onLike={() => {}}
            onShare={() => {}}
            onComment={() => {}}
            showCommentPreview={false}
          />
        </CardContent>
      </Card>

      {/* Product Features Table (full width) */}
      {product.featureMap && Object.keys(product.featureMap).length > 0 && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Product Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-primary">Our Product</TableHead>
                    <TableHead>Competitor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(product.featureMap).map(([feature, value]) => (
                    <TableRow key={feature}>
                      <TableCell className="font-medium">{feature}</TableCell>
                      <TableCell className="text-primary font-medium">{value}</TableCell>
                      <TableCell className="text-muted-foreground">-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Section (full width) */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-foreground">Customer Reviews</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                />
              ))}
            </div>
            <span className="text-lg font-medium">{product.averageRating?.toFixed(1) || '0.0'}</span>
            <span className="text-muted-foreground">based on {product.totalRatings || 0} reviews</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-1">
                  <span className="font-semibold mr-2">{review.userName}</span>
                  <span className="text-xs text-muted-foreground">{review.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-1">{review.comment}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Heart size={14} className="mr-1" /> {review.likes} likes
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Similar Products (full width) */}
      {mockSimilarProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Similar Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockSimilarProducts.map((sim) => (
                <div key={sim.id} className="bg-card rounded-lg p-4 flex flex-col items-center border">
                  <img src={sim.images[0]} alt={sim.name} className="w-24 h-24 object-cover rounded mb-2" />
                  <div className="font-medium text-center mb-1">{sim.name}</div>
                  <div className="text-sm text-muted-foreground mb-1">{sim.company.name}</div>
                  <div className="text-lg font-bold text-foreground mb-1">${sim.price}</div>
                  {sim.discount > 0 && (
                    <span className="bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 px-2 py-0.5 rounded-full text-xs font-medium">
                      {sim.discount}% OFF
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductPreview;
