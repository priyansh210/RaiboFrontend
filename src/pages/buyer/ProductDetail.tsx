
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductInteractions from '../../components/ProductInteractions';
import { useCart } from '../../context/CartContext';
import { getProductById, getSimilarProducts } from '../../services/ProductService';
import { Product } from '../../models/internal/Product';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Info, 
  Heart, 
  Star, 
  ShoppingCart,
  Share2,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  // Dummy comparison data
  const comparisonData = [
    { feature: 'Material', value: 'Premium Oak Wood', competitor: 'Pine Wood' },
    { feature: 'Warranty', value: '5 Years', competitor: '2 Years' },
    { feature: 'Assembly', value: 'Professional Setup Included', competitor: 'Self Assembly' },
    { feature: 'Dimensions', value: '120 x 80 x 75 cm', competitor: '110 x 75 x 70 cm' },
    { feature: 'Weight Capacity', value: '150 kg', competitor: '100 kg' },
    { feature: 'Finish', value: 'Hand-crafted Polish', competitor: 'Machine Polish' },
  ];

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
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct({
            ...productData,
            interactions: {
              likes: Math.floor(Math.random() * 500) + 50,
              shares: Math.floor(Math.random() * 100) + 10,
              comments: dummyReviews,
              userHasLiked: false,
              userHasShared: false,
            }
          });
          setSelectedImage(productData.images?.[0] || 'https://picsum.photos/600/400');
          setSelectedColor(productData.userPreferences?.preferredColors?.[0] || null);
          
          const similar = await getSimilarProducts(productData);
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
      quantity: quantity ?? 1, // default to 1 if quantity is undefined
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

  const handleLike = (productId: string) => {
    if (!product) return;
    setProduct(prev => prev ? {
      ...prev,
      interactions: {
        ...prev.interactions!,
        likes: prev.interactions!.userHasLiked ? prev.interactions!.likes - 1 : prev.interactions!.likes + 1,
        userHasLiked: !prev.interactions!.userHasLiked,
      }
    } : null);
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

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
            <h2 className="text-xl text-charcoal">Loading product...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <div className="bg-white p-8 text-center rounded-lg">
              <h2 className="text-2xl text-charcoal mb-4">Product Not Found</h2>
              <p className="text-earth mb-6">The product you're looking for doesn't exist or has been removed.</p>
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <Link to="/browse" className="text-earth hover:text-terracotta flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Back to Browse
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden relative group">
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
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={currentImageIndex === product.images.length - 1}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        setSelectedImage(image);
                        setCurrentImageIndex(index);
                      }}
                      className={`w-20 h-20 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === image ? 'border-terracotta' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${product.name} thumbnail ${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <div className="bg-white rounded-2xl p-6 md:p-8">
                <h1 className="font-playfair text-3xl md:text-4xl text-charcoal mb-2">{product.name}</h1>
                <p className="text-earth text-lg mb-4">{product.company.name}</p>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        className={i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-earth text-sm ml-3">
                    {product.averageRating?.toFixed(1) || '0.0'} ({product.totalRatings || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-charcoal">${product.price}</span>
                  {product.discount > 0 && (
                    <span className="ml-3 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-earth mb-8 leading-relaxed">{product.description}</p>

                {/* Color Selection */}
                {product.userPreferences?.preferredColors && product.userPreferences.preferredColors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-charcoal mb-3">Color Options</h3>
                    <div className="flex space-x-3">
                      {product.userPreferences.preferredColors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-12 h-12 rounded-full border-4 transition-all ${
                            selectedColor?.code === color.code ? 'border-terracotta scale-110' : 'border-gray-200'
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
                  <h3 className="text-lg font-medium text-charcoal mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                    <span className="text-sm text-earth ml-4">{product.quantity} available</span>
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
                  <button className="flex-1 border border-terracotta text-terracotta py-3 px-6 rounded-lg hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center text-lg font-medium">
                    <Heart size={20} className="mr-2" />
                    Wishlist
                  </button>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center text-sm text-earth">
                    <Truck size={20} className="mr-2 text-terracotta" />
                    Free Delivery
                  </div>
                  <div className="flex items-center text-sm text-earth">
                    <ShieldCheck size={20} className="mr-2 text-terracotta" />
                    2 Year Warranty
                  </div>
                  <div className="flex items-center text-sm text-earth">
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
                showCommentPreview={false}
              />
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">Product Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-terracotta font-medium">Our Product</TableHead>
                    <TableHead>Competitor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.feature}</TableCell>
                      <TableCell className="text-terracotta font-medium">{item.value}</TableCell>
                      <TableCell className="text-gray-600">{item.competitor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">Customer Reviews</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{product.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-earth">based on {product.totalRatings || 0} reviews</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dummyReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-charcoal">{review.userName}</h4>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-earth">{review.createdAt.toLocaleDateString()}</span>
                    </div>
                    <p className="text-earth mb-3">{review.comment}</p>
                    <div className="flex items-center space-x-4 text-sm text-earth">
                      <button className="flex items-center space-x-1 hover:text-terracotta">
                        <Heart size={14} />
                        <span>{review.likes}</span>
                      </button>
                      <button className="hover:text-terracotta">Reply</button>
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
                <CardTitle className="text-2xl text-charcoal">Similar Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarProducts.slice(0, 4).map((similarProduct) => (
                    <Link 
                      key={similarProduct.id} 
                      to={`/product/${similarProduct.id}`}
                      className="group"
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img 
                          src={similarProduct.images?.[0] || 'https://picsum.photos/200/200'} 
                          alt={similarProduct.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <h3 className="font-medium text-charcoal mb-1 line-clamp-2">{similarProduct.name}</h3>
                          <p className="text-sm text-earth mb-2">{similarProduct.company.name}</p>
                          <p className="text-lg font-bold text-terracotta">${similarProduct.price}</p>
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
