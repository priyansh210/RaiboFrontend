
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, Star, Eye } from 'lucide-react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { Product } from '../models/internal/Product';
import { fetchProducts } from '../services/ProductService';
import { apiService } from '@/services/ApiService';
import { toast } from '@/hooks/use-toast';

const SellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isSeller, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSeller) {
      navigate('/');
      return;
    }

    const loadProducts = async () => {
      try {
        const allProducts = await fetchProducts();
        // For now, show all products since we don't have seller filtering implemented
        // In a real app, you would filter by seller ID from the API
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [isSeller, navigate, user]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (productId: string) => {
    const company_id = user?.companyId
    apiService.deleteProduct(company_id, productId) // Implement using Product Service as wrapper
      .then(() => {
        setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
        toast({
                  title: 'Success',
                  description: 'Product deleted successfully.',
                  variant: 'default',
                });
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product.',
          variant: 'destructive',
        });
      });
    console.log('Delete product:', productId);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-cream pt-24">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="font-playfair text-3xl text-charcoal mb-2">My Products</h1>
              <p className="text-earth">Manage your product catalog</p>
            </div>
            <Link to="/seller/products/add">
              <Button className="bg-terracotta hover:bg-umber text-white mt-4 md:mt-0">
                <Plus size={16} className="mr-2" />
                Add New Product
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-taupe/30"
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-white border-taupe/20 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {product.featured && (
                          <Badge className="bg-terracotta text-white">Featured</Badge>
                        )}
                        {product.new && (
                          <Badge className="bg-olive text-white">New</Badge>
                        )}
                        {product.bestSeller && (
                          <Badge className="bg-umber text-white">Best Seller</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-charcoal line-clamp-1">{product.name}</h3>
                      <span className="text-terracotta font-semibold">${product.price}</span>
                    </div>
                    
                    <p className="text-earth text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-earth mb-4">
                      <span>Category: {product.category.name}</span>
                      <span>Stock: {product.quantity}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-500 mr-1" />
                        <span>{product.averageRating.toFixed(1)} ({product.totalRatings})</span>
                      </div>
                      <div className="flex items-center">
                        <Eye size={14} className="text-earth mr-1" />
                        <span>{product.interactions.likes}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/seller/products/edit/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-terracotta text-terracotta hover:bg-terracotta hover:text-white">
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-taupe mb-4" />
              <h3 className="text-xl font-medium text-charcoal mb-2">No products found</h3>
              <p className="text-earth mb-6">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by adding your first product'}
              </p>
              <Link to="/seller/products/add">
                <Button className="bg-terracotta hover:bg-umber text-white">
                  <Plus size={16} className="mr-2" />
                  Add New Product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SellerProducts;
