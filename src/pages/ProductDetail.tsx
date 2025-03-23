
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ColorPicker from '../components/ColorPicker';
import { getProductById, getSimilarProducts } from '../data/products';
import { Minus, Plus, ShoppingCart, Heart, Share2, ArrowLeft, Star, Info, Truck, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  const similarProducts = product ? getSimilarProducts(product) : [];
  
  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl text-charcoal mb-4">Product Not Found</h1>
          <p className="text-earth mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse" className="text-terracotta hover:text-umber transition-colors">
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleAddToCart = () => {
    if (selectedColor) {
      addToCart({
        ...product,
        selectedColor,
        quantity,
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        duration: 3000,
      });
    }
  };
  
  return (
    <Layout>
      <div className="page-transition">
        <div className="container-custom py-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-earth space-x-2">
              <Link to="/" className="hover:text-terracotta transition-colors">Home</Link>
              <span>/</span>
              <Link to={`/browse/${product.category}`} className="hover:text-terracotta transition-colors">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Link>
              <span>/</span>
              <Link to={`/browse/${product.subcategory}`} className="hover:text-terracotta transition-colors">
                {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
              </Link>
              <span>/</span>
              <span className="text-charcoal font-medium truncate max-w-[150px]">{product.name}</span>
            </div>
          </div>
          
          {/* Back to results link - Mobile */}
          <div className="block md:hidden mb-4">
            <Link to="/browse" className="flex items-center text-earth text-sm hover:text-terracotta transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Back to results
            </Link>
          </div>
          
          {/* Product Detail */}
          <div className="flex flex-col md:flex-row gap-8 mb-16">
            {/* Product Images */}
            <div className="md:w-3/5">
              <div className="relative bg-white rounded-sm overflow-hidden mb-4">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name}
                  className="w-full h-auto aspect-square object-cover"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-20 border-2 ${
                      activeImage === index ? 'border-terracotta' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="md:w-2/5">
              <div className="bg-white p-6 rounded-sm animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {product.bestSeller && (
                      <span className="inline-block bg-terracotta text-white text-xs px-2 py-1 mb-2">
                        BESTSELLER
                      </span>
                    )}
                    {product.new && (
                      <span className="inline-block bg-umber text-white text-xs px-2 py-1 mb-2 ml-2">
                        NEW
                      </span>
                    )}
                    
                    <h1 className="text-2xl font-playfair text-charcoal">{product.name}</h1>
                    <p className="text-earth mt-1">{product.brand}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-earth hover:text-terracotta transition-colors" aria-label="Save to wishlist">
                      <Heart size={20} />
                    </button>
                    <button className="p-2 text-earth hover:text-terracotta transition-colors" aria-label="Share">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-medium text-charcoal">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  <div className="flex items-center">
                    <div className="flex text-terracotta">
                      {Array(5).fill(0).map((_, index) => (
                        <Star 
                          key={index} 
                          size={16} 
                          fill={index < Math.floor(product.ratings.average) ? "#D27D56" : "none"} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-earth ml-2">
                      ({product.ratings.count} reviews)
                    </span>
                  </div>
                </div>
                
                {/* Available Colors */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-charcoal mb-3">Color: {selectedColor?.name}</h3>
                  <ColorPicker 
                    colors={product.colors} 
                    selectedColor={selectedColor || product.colors[0]} 
                    onChange={setSelectedColor}
                  />
                </div>
                
                {/* Quantity */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-charcoal mb-3">Quantity</h3>
                  <div className="flex items-center border border-taupe/30 inline-flex">
                    <button 
                      onClick={decreaseQuantity}
                      className="py-2 px-3 text-earth hover:text-terracotta disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="py-2 px-4 text-charcoal border-l border-r border-taupe/30">
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQuantity}
                      className="py-2 px-3 text-earth hover:text-terracotta disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-earth mt-2">
                    {product.stock > 10 
                      ? 'In stock, ready to ship' 
                      : product.stock > 0 
                        ? `Only ${product.stock} left in stock` 
                        : 'Out of stock'
                    }
                  </p>
                </div>
                
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full py-3 mb-4 flex items-center justify-center bg-terracotta hover:bg-umber text-white transition-colors disabled:bg-gray-400"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                {/* Delivery Info */}
                <div className="bg-linen p-4 mb-6">
                  <div className="flex items-start mb-2">
                    <Truck size={18} className="text-terracotta mr-2 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-charcoal font-medium">{product.deliveryInfo}</p>
                      <p className="text-xs text-earth">
                        Free delivery on orders over $1,000
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle size={18} className="text-terracotta mr-2 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-charcoal font-medium">Easy Returns</p>
                      <p className="text-xs text-earth">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Product Highlights */}
                <div className="mb-6">
                  <div className="flex items-start mb-2">
                    <Info size={16} className="text-terracotta mr-2 flex-shrink-0 mt-1" />
                    <p className="text-sm text-earth">
                      <span className="text-charcoal font-medium">Material:</span> {product.material}
                    </p>
                  </div>
                  <div className="flex items-start mb-2">
                    <Info size={16} className="text-terracotta mr-2 flex-shrink-0 mt-1" />
                    <p className="text-sm text-earth">
                      <span className="text-charcoal font-medium">Dimensions:</span> {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} {product.dimensions.unit}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <Info size={16} className="text-terracotta mr-2 flex-shrink-0 mt-1" />
                    <p className="text-sm text-earth">
                      <span className="text-charcoal font-medium">Weight:</span> {product.weight.value} {product.weight.unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="mb-16">
            <div className="border-b border-taupe/20 mb-6">
              <div className="flex overflow-x-auto">
                <button
                  className={`py-3 px-6 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'description' 
                      ? 'text-terracotta border-b-2 border-terracotta' 
                      : 'text-earth hover:text-terracotta'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`py-3 px-6 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'details' 
                      ? 'text-terracotta border-b-2 border-terracotta' 
                      : 'text-earth hover:text-terracotta'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
                <button
                  className={`py-3 px-6 text-sm font-medium whitespace-nowrap ${
                    activeTab === 'reviews' 
                      ? 'text-terracotta border-b-2 border-terracotta' 
                      : 'text-earth hover:text-terracotta'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews ({product.ratings.count})
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-sm animate-fade-in">
              {activeTab === 'description' && (
                <div>
                  <p className="text-earth leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
              
              {activeTab === 'details' && (
                <div>
                  <h3 className="text-lg font-medium text-charcoal mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b border-taupe/10 pb-3">
                      <p className="text-sm text-earth">
                        <span className="font-medium text-charcoal">Brand:</span> {product.brand}
                      </p>
                    </div>
                    <div className="border-b border-taupe/10 pb-3">
                      <p className="text-sm text-earth">
                        <span className="font-medium text-charcoal">Material:</span> {product.material}
                      </p>
                    </div>
                    <div className="border-b border-taupe/10 pb-3">
                      <p className="text-sm text-earth">
                        <span className="font-medium text-charcoal">Dimensions:</span> {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} {product.dimensions.unit}
                      </p>
                    </div>
                    <div className="border-b border-taupe/10 pb-3">
                      <p className="text-sm text-earth">
                        <span className="font-medium text-charcoal">Weight:</span> {product.weight.value} {product.weight.unit}
                      </p>
                    </div>
                    <div className="border-b border-taupe/10 pb-3">
                      <p className="text-sm text-earth">
                        <span className="font-medium text-charcoal">Available Colors:</span> {product.colors.map(c => c.name).join(', ')}
                      </p>
                    </div>
                    <div className="border-b border-taupe/10 pb-3">
                      <p className="text-sm text-earth">
                        <span className="font-medium text-charcoal">Item ID:</span> {product.id}
                      </p>
                    </div>
                  </div>
                  
                  {product.additionalInfo && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-charcoal mb-4">Additional Information</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {product.additionalInfo.map((info, index) => (
                          <li key={index} className="text-sm text-earth">{info}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center mb-6">
                    <div className="mr-4">
                      <span className="text-4xl font-medium text-charcoal">{product.ratings.average.toFixed(1)}</span>
                      <div className="flex text-terracotta mt-1">
                        {Array(5).fill(0).map((_, index) => (
                          <Star 
                            key={index} 
                            size={16} 
                            fill={index < Math.floor(product.ratings.average) ? "#D27D56" : "none"} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-earth mt-1">
                        Based on {product.ratings.count} reviews
                      </p>
                    </div>
                    
                    <div className="flex-grow">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const percentage = Math.floor(Math.random() * 100); // Mock data
                        return (
                          <div key={rating} className="flex items-center mb-1">
                            <span className="text-xs text-earth w-6">{rating}</span>
                            <div className="w-full bg-taupe/10 h-2 mx-2">
                              <div 
                                className="bg-terracotta h-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-earth w-10">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <button className="bg-sand hover:bg-taupe hover:text-white text-charcoal py-2 px-4 transition-colors">
                    Write a Review
                  </button>
                  
                  <div className="mt-8 space-y-6">
                    {/* Mock reviews */}
                    {[
                      {
                        name: 'Michael T.',
                        rating: 5,
                        date: '2023-05-10',
                        title: 'Excellent quality and design',
                        comment: 'I absolutely love this piece! The craftsmanship is outstanding and it fits perfectly in my living room. The color is exactly as shown in the pictures.',
                        verified: true,
                      },
                      {
                        name: 'Sarah L.',
                        rating: 4,
                        date: '2023-04-22',
                        title: 'Beautiful but assembly was challenging',
                        comment: 'This is a gorgeous addition to my home, but the assembly instructions could have been clearer. Once put together, it looks amazing though!',
                        verified: true,
                      },
                      {
                        name: 'David R.',
                        rating: 5,
                        date: '2023-03-15',
                        title: 'Worth every penny',
                        comment: 'The quality exceeded my expectations. Very sturdy and well-made. Delivery was also prompt and the white glove service was excellent.',
                        verified: false,
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-taupe/10 pb-6">
                        <div className="flex justify-between mb-2">
                          <div>
                            <span className="font-medium text-charcoal mr-2">{review.name}</span>
                            {review.verified && (
                              <span className="text-xs bg-linen text-earth px-2 py-1 rounded-sm">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-earth">{review.date}</span>
                        </div>
                        
                        <div className="flex text-terracotta mb-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              fill={i < review.rating ? "#D27D56" : "none"} 
                            />
                          ))}
                        </div>
                        
                        <h4 className="font-medium text-charcoal mb-1">{review.title}</h4>
                        <p className="text-sm text-earth">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Similar Products */}
          <div>
            <h2 className="font-playfair text-2xl text-charcoal mb-6">You Might Also Like</h2>
            <div className="product-grid">
              {similarProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
