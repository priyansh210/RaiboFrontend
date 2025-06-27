import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductInteractions from '../components/ProductInteractions';
import CommentsModal from '../components/CommentsModal';
import AddToRoomModal from '../components/AddToRoomModal';
import Product3DViewer from '../components/Product3DViewer';
import { useCart } from '../context/CartContext';
import { productService } from '../services/ProductService';
import { Product } from '../models/internal/Product';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/services/ApiService';
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Star, 
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; code: string } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showAddToRoomModal, setShowAddToRoomModal] = useState(false);
  const [commentsModal, setCommentsModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({ isOpen: false, productId: '', productName: '' });

  // Dummy reviews data
  const dummyReviews = [
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

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await productService.getProductById(id);
        
        if (productData) {
          // Generate interactions for this product
          const interactions = {
            likes: Math.floor(Math.random() * 500) + 10,
            shares: Math.floor(Math.random() * 100) + 5,
            comments: [
              {
                id: `${productData.id}-comment-1`,
                userId: 'user1',
                userName: 'Sarah Chen',
                rating: 5,
                comment: 'Absolutely love this! Quality is amazing and arrived quickly.',
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                likes: Math.floor(Math.random() * 20),
                userHasLiked: false,
              },
              {
                id: `${productData.id}-comment-2`,
                userId: 'user2',
                userName: 'Mike Johnson',
                rating: 4,
                comment: 'Great product, exactly as described. Highly recommend!',
                createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                likes: Math.floor(Math.random() * 15),
                userHasLiked: false,
              },
            ],
            userHasLiked: false,
            userHasShared: false,
          };

          setProduct({ ...productData, interactions });
          setSelectedImage(productData.images?.[0] || 'https://picsum.photos/600/400');
          setSelectedColor(productData.userPreferences?.preferredColors?.[0] || null);
          
          const similar = await productService.getSimilarProducts(productData.id);
          setSimilarProducts(similar);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.quantity) {
      toast({
        title: 'Cannot add more',
        description: `Only ${product.quantity} items available in stock`,
        variant: 'destructive',
      });
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor) {
      toast({
        title: 'Error',
        description: 'Please select a color before adding to cart.',
        variant: 'destructive',
      });
      return;
    }
  
    const cartItem = {
      ...product,
      selectedColor: {
        name: selectedColor.name,
        code: selectedColor.code,
      },
      quantity: quantity ?? 1,
    };
  
    addToCart(cartItem);
  
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const nextImage = () => {
    if (product?.images && currentImageIndex < product.images.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(product.images[newIndex]);
    }
  };

  const prevImage = () => {
    if (product?.images && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setSelectedImage(product.images[newIndex]);
    }
  };

  const handleLike = async (productId: string) => {
    if (!product) return;
    
    try {
      await apiService.handleLike(productId);
      
      setProduct(prev => prev ? {
        ...prev,
        interactions: {
          ...prev.interactions!,
          likes: prev.interactions!.userHasLiked ? prev.interactions!.likes - 1 : prev.interactions!.likes + 1,
          userHasLiked: !prev.interactions!.userHasLiked,
        }
      } : null);
      
      toast({
        title: product.interactions!.userHasLiked ? "Unliked!" : "Liked!",
        description: product.interactions!.userHasLiked ? "Removed from favorites" : "Added to favorites",
      });
    } catch (error) {
      console.error('Failed to like product:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleShare = (productId: string) => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard.",
      });
    }
  };

  const handleComment = (productId: string) => {
    if (product) {
      setCommentsModal({
        isOpen: true,
        productId,
        productName: product.name,
      });
    }
  };

  const handleAddComment = async (productId: string, comment: string) => {
    try {
      const response = await productService.addComment(productId, comment);
      
      if (product) {
        const newComment = {
          id: response.id || Date.now().toString(),
          userId: 'current-user',
          userName: 'You',
          rating: 5,
          comment: comment,
          createdAt: new Date(),
          likes: 0,
          userHasLiked: false,
        };
        
        setProduct(prev => prev ? {
          ...prev,
          interactions: {
            ...prev.interactions!,
            comments: [newComment, ...prev.interactions!.comments],
          }
        } : null);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleReplyToComment = async (commentId: string, reply: string) => {
    try {
      await productService.replyToComment(commentId, reply);
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      throw error;
    }
  };

  const handleAddToRoom = () => {
    setShowAddToRoomModal(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
            <h2 className="text-xl text-foreground">Loading product...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-10">
          <div className="container mx-auto px-4">
            <div className="bg-card p-8 text-center rounded-lg">
              <h2 className="text-2xl text-foreground mb-4">Product Not Found</h2>
              <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Link
                to="/browse"
                className="bg-terracotta text-white py-2 px-6 inline-block hover:bg-umber transition-colors rounded-lg"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Build comparison data from product.featureMap if available
  const comparisonData = product && product.featureMap
    ? Object.entries(product.featureMap).map(([feature, value]) => ({
        feature,
        value,
        competitor: '-', // Placeholder, can be replaced with real competitor data if available
      }))
    : [
        { feature: 'Material', value: 'Premium Oak Wood', competitor: 'Pine Wood' },
        { feature: 'Warranty', value: '5 Years', competitor: '2 Years' },
        { feature: 'Assembly', value: 'Professional Setup Included', competitor: 'Self Assembly' },
        { feature: 'Dimensions', value: '120 x 80 x 75 cm', competitor: '110 x 75 x 70 cm' },
        { feature: 'Weight Capacity', value: '150 kg', competitor: '100 kg' },
        { feature: 'Finish', value: 'Hand-crafted Polish', competitor: 'Machine Polish' },
      ];

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <Link to="/browse" className="text-muted-foreground hover:text-primary flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Back to Browse
            </Link>
          </nav>

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
                      {product.images.map((image, index) => (
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
                  <Product3DViewer productName={product.name} />
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

                {/* Color Selection */}
                {product.userPreferences?.preferredColors && product.userPreferences.preferredColors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3">Color Options</h3>
                    <div className="flex space-x-3">
                      {product.userPreferences.preferredColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${
                            selectedColor?.code === color.code ? 'border-terracotta scale-110' : 'border-border'
                          }`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-foreground mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-accent"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-accent"
                    >
                      +
                    </button>
                    <span className="text-sm text-muted-foreground ml-4">{product.quantity} available</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-terracotta text-white py-3 px-6 rounded-lg hover:bg-umber transition-colors flex items-center justify-center text-lg font-medium"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleAddToRoom}
                    className="flex-1 border border-terracotta text-terracotta py-3 px-6 rounded-lg hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center text-lg font-medium"
                  >
                    <Home size={20} className="mr-2" />
                    Add to Room
                  </button>
                  <button className="flex-1 border border-terracotta text-terracotta py-3 px-6 rounded-lg hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center text-lg font-medium">
                    <Heart size={20} className="mr-2" />
                    Wishlist
                  </button>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border/50">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck size={20} className="mr-2 text-terracotta" />
                    Free Delivery
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck size={20} className="mr-2 text-terracotta" />
                    2 Year Warranty
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <RefreshCw size={20} className="mr-2 text-terracotta" />
                    Easy Returns
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Interactions */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <ProductInteractions
                productId={product.id}
                interactions={product.interactions!}
                ratings={{ average: product.averageRating, count: product.totalRatings }}
                onLike={handleLike}
                onShare={handleShare}
                onComment={handleComment}
                showCommentPreview={false}
              />
            </CardContent>
          </Card>

          {/* Comments Section */}
          {commentsModal.isOpen && (
            <CommentsModal
              isOpen={commentsModal.isOpen}
              onClose={() => setCommentsModal({ isOpen: false, productId: '', productName: '' })}
              productId={commentsModal.productId}
              comments={product?.interactions?.comments || []}
              onAddComment={handleAddComment}
              onReplyToComment={handleReplyToComment}
              productName={commentsModal.productName}
            />
          )}

          {/* Add to Room Modal */}
          <AddToRoomModal
            isOpen={showAddToRoomModal}
            onClose={() => setShowAddToRoomModal(false)}
            productId={product.id}
            productName={product.name}
          />

          {/* Comparison Table */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Product Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-primary font-medium">Our Product</TableHead>
                    <TableHead>Competitor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.feature}</TableCell>
                      <TableCell className="text-primary font-medium">{item.value}</TableCell>
                      <TableCell className="text-muted-foreground">{item.competitor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reviews Section */}
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
                {dummyReviews.map((review) => (
                  <div key={review.id} className="border-b border-border/50 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{review.userName}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.createdAt.toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">{review.comment}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <button className="flex items-center space-x-1 hover:text-primary">
                        <Heart size={14} />
                        <span>{review.likes}</span>
                      </button>
                      <button className="hover:text-primary">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Similar Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarProducts.slice(0, 4).map((similarProduct) => (
                    <Link
                      key={similarProduct.id}
                      to={`/product/${similarProduct.id}`}
                      className="group"
                    >
                      <div className="bg-accent rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                          src={similarProduct.images?.[0] || 'https://picsum.photos/200/200'}
                          alt={similarProduct.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-foreground mb-1 line-clamp-2">{similarProduct.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{similarProduct.company.name}</p>
                          <p className="text-lg font-bold text-primary">${similarProduct.price}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
