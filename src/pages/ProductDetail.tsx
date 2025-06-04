import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { getProductById, getSimilarProducts } from '../services/ProductService';
import { Product } from '../models/internal/Product';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Info, 
  Heart, 
  Star, 
  ShoppingCart 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; code: string } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch product and similar products
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.images?.[0] || 'https://picsum.photos/200'); // Safely access images
          setSelectedColor(productData.userPreferences?.preferredColors?.[0] || null); // Safely access colors
          
          // Fetch similar products
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
    if (!product || !selectedColor) return;
    
    // addToCart({
    //   ...product,
    //   quantity,
    //   selectedColor,
    // });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-cream flex items-center justify-center">
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
        <div className="min-h-screen bg-cream py-10">
          <div className="container mx-auto px-4">
            <div className="bg-white p-8 text-center">
              <h2 className="text-2xl text-charcoal mb-4">Product Not Found</h2>
              <p className="text-earth mb-6">The product you're looking for doesn't exist or has been removed.</p>
              <Link 
                to="/browse" 
                className="bg-terracotta text-white py-2 px-6 inline-block hover:bg-umber transition-colors"
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
      <div className="min-h-screen bg-cream py-10">
        <div className="container-custom">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <Link to="/browse" className="text-earth hover:text-terracotta flex items-center text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Back to Browse
            </Link>
          </nav>

          <div className="bg-white p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-linen relative">
                  <img 
                    src={selectedImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button 
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`w-20 h-20 flex-shrink-0 border-2 transition-all ${
                          selectedImage === image ? 'border-terracotta' : 'border-transparent'
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
                <h1 className="font-playfair text-3xl text-charcoal">{product.name}</h1>
                <p className="text-earth mt-1">{product.company.name}</p>
                
                <div className="flex items-center mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.averageRating || 0) ? 'fill-terracotta text-terracotta' : 'text-taupe'}
                      />
                    ))}
                  </div>
                  <span className="text-earth text-sm ml-2">
                    {product.averageRating?.toFixed(1) || '0.0'} ({product.totalRatings || 0} reviews)
                  </span>
                </div>
                
                {/* Other product details */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;