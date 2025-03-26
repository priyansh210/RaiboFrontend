
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { getProductById, getSimilarProducts } from '../services/ProductService';
import { Product } from '../data/products';
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
  const [selectedColor, setSelectedColor] = useState<{name: string, code: string} | null>(null);
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
          setSelectedImage(productData.images[0] || '/placeholder.svg');
          setSelectedColor(productData.colors[0] || null);
          
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
    if (product && value > product.stock) {
      toast({
        title: 'Cannot add more',
        description: `Only ${product.stock} items available in stock`,
        variant: 'destructive',
      });
      return;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor) return;
    
    addToCart({
      ...product,
      quantity,
      selectedColor,
    });
    
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
                {product.images.length > 1 && (
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
                <p className="text-earth mt-1">{product.brand}</p>
                
                <div className="flex items-center mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < Math.floor(product.ratings.average) ? 'fill-terracotta text-terracotta' : 'text-taupe'}
                      />
                    ))}
                  </div>
                  <span className="text-earth text-sm ml-2">{product.ratings.average} ({product.ratings.count} reviews)</span>
                </div>
                
                <div className="mt-6">
                  <p className="text-2xl font-medium text-charcoal">${product.price.toFixed(2)}</p>
                  <p className="text-earth text-sm mt-1">
                    {product.stock > 0 
                      ? `In stock (${product.stock} available)` 
                      : 'Out of stock'}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-charcoal">Description</h3>
                  <p className="mt-2 text-earth">{product.description}</p>
                </div>
                
                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium text-charcoal mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color.name}
                          className={`w-10 h-10 rounded-full transition-all ${
                            selectedColor?.name === color.name ? 'ring-2 ring-terracotta ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color.code }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="text-earth text-sm mt-2">Selected: {selectedColor.name}</p>
                    )}
                  </div>
                )}
                
                {/* Quantity Selector */}
                <div className="mt-6">
                  <h3 className="font-medium text-charcoal mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="w-10 h-10 bg-linen text-charcoal border border-taupe/20 flex items-center justify-center"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      max={product.stock} 
                      value={quantity} 
                      onChange={(e) => handleQuantityChange(Number(e.target.value))}
                      className="w-16 h-10 border-y border-taupe/20 text-center appearance-none"
                    />
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="w-10 h-10 bg-linen text-charcoal border border-taupe/20 flex items-center justify-center"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-grow py-3 bg-terracotta hover:bg-umber text-white transition-colors flex items-center justify-center gap-2 disabled:bg-taupe/40 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    className="py-3 px-4 border border-taupe/20 hover:bg-linen transition-colors flex items-center justify-center"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} />
                  </button>
                </div>
                
                {/* Product Guarantees */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <Truck className="text-terracotta flex-shrink-0 mr-3 mt-1" size={18} />
                    <div>
                      <h4 className="text-charcoal font-medium">Free Delivery</h4>
                      <p className="text-earth text-sm">{product.deliveryInfo}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ShieldCheck className="text-terracotta flex-shrink-0 mr-3 mt-1" size={18} />
                    <div>
                      <h4 className="text-charcoal font-medium">Quality Guarantee</h4>
                      <p className="text-earth text-sm">Premium materials and craftsmanship</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RefreshCw className="text-terracotta flex-shrink-0 mr-3 mt-1" size={18} />
                    <div>
                      <h4 className="text-charcoal font-medium">30-Day Returns</h4>
                      <p className="text-earth text-sm">Shop with confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details & Specifications */}
            <div className="mt-16">
              <h2 className="font-playfair text-2xl text-charcoal mb-6">Product Details</h2>
              
              <div className="border-t border-taupe/10">
                <div className="py-4 border-b border-taupe/10 grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1 font-medium text-charcoal">Brand</div>
                  <div className="md:col-span-3 text-earth">{product.brand}</div>
                </div>
                
                <div className="py-4 border-b border-taupe/10 grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1 font-medium text-charcoal">Material</div>
                  <div className="md:col-span-3 text-earth">{product.material || 'Not specified'}</div>
                </div>
                
                <div className="py-4 border-b border-taupe/10 grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1 font-medium text-charcoal">Dimensions</div>
                  <div className="md:col-span-3 text-earth">
                    {product.dimensions 
                      ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} ${product.dimensions.unit}`
                      : 'Not specified'}
                  </div>
                </div>
                
                <div className="py-4 border-b border-taupe/10 grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1 font-medium text-charcoal">Weight</div>
                  <div className="md:col-span-3 text-earth">
                    {product.weight ? `${product.weight.value} ${product.weight.unit}` : 'Not specified'}
                  </div>
                </div>
                
                {product.additionalInfo && product.additionalInfo.length > 0 && (
                  <div className="py-4 border-b border-taupe/10 grid grid-cols-1 md:grid-cols-4">
                    <div className="md:col-span-1 font-medium text-charcoal">Additional Information</div>
                    <div className="md:col-span-3 text-earth">
                      <ul className="list-disc pl-5">
                        {product.additionalInfo.map((info, index) => (
                          <li key={index}>{info}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-linen flex items-start">
                <Info size={20} className="text-terracotta flex-shrink-0 mr-3 mt-1" />
                <p className="text-earth text-sm">
                  Due to display settings, actual colors may vary slightly from what appears on your screen. 
                  Product measurements may vary by up to 3%.
                </p>
              </div>
            </div>
            
            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="font-playfair text-2xl text-charcoal mb-6">You Might Also Like</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarProducts.map(similar => (
                    <Link 
                      key={similar.id} 
                      to={`/product/${similar.id}`} 
                      className="group"
                    >
                      <div className="aspect-square overflow-hidden bg-linen">
                        <img 
                          src={similar.images[0]} 
                          alt={similar.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="mt-2 font-medium text-charcoal group-hover:text-terracotta transition-colors">{similar.name}</h3>
                      <p className="text-earth">${similar.price.toFixed(2)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
