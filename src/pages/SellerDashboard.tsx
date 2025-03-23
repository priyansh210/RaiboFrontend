
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { supabase } from '../integrations/supabase/client';
import { Package, ShoppingCart, Star, BarChart3, DollarSign, Users, PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const SellerDashboard = () => {
  const { user, isAuthenticated, isLoading, isSeller } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  useEffect(() => {
    // Redirect if not authenticated or not a seller
    if (!isLoading && (!isAuthenticated || !isSeller)) {
      toast({
        title: "Access Denied",
        description: "You need to be logged in as a seller to access this page.",
        variant: "destructive",
      });
      navigate('/seller/login', { replace: true });
    } else if (isAuthenticated && isSeller) {
      // Fetch seller data
      fetchSellerData();
    }
  }, [isAuthenticated, isLoading, isSeller, navigate]);
  
  const fetchSellerData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (productsError) throw productsError;
      setProducts(productsData || []);
      
      // Fetch orders containing seller's products
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, 
          status, 
          total_amount, 
          created_at,
          order_items!inner(
            product_id,
            products!inner(
              seller_id
            )
          )
        `)
        .eq('order_items.products.seller_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      
      // Remove duplicates (in case multiple products from the same seller are in one order)
      const uniqueOrders = Array.from(
        new Map(ordersData.map(order => [order.id, order])).values()
      );
      
      setOrders(uniqueOrders || []);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      toast({
        title: "Error",
        description: "Failed to load seller data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  // Calculate dashboard stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount as unknown as string), 0);
  const lowStockProducts = products.filter(product => product.stock < 5).length;
  
  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5);
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom">
          <div className="bg-white p-6 shadow-sm rounded-sm">
            <h1 className="font-playfair text-3xl text-charcoal">Seller Dashboard</h1>
            
            {isLoadingData ? (
              <div className="my-10 text-center">
                <span className="animate-pulse">Loading seller data...</span>
              </div>
            ) : (
              <>
                {/* Dashboard Tabs */}
                <div className="border-b border-taupe/20 mt-6">
                  <nav className="flex space-x-4 -mb-px">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'overview'
                          ? 'border-terracotta text-terracotta'
                          : 'border-transparent text-earth hover:text-terracotta hover:border-terracotta/30'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('products')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'products'
                          ? 'border-terracotta text-terracotta'
                          : 'border-transparent text-earth hover:text-terracotta hover:border-terracotta/30'
                      }`}
                    >
                      Products
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'orders'
                          ? 'border-terracotta text-terracotta'
                          : 'border-transparent text-earth hover:text-terracotta hover:border-terracotta/30'
                      }`}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'reviews'
                          ? 'border-terracotta text-terracotta'
                          : 'border-transparent text-earth hover:text-terracotta hover:border-terracotta/30'
                      }`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'analytics'
                          ? 'border-terracotta text-terracotta'
                          : 'border-transparent text-earth hover:text-terracotta hover:border-terracotta/30'
                      }`}
                    >
                      Analytics
                    </button>
                  </nav>
                </div>
                
                {/* Tab Content */}
                <div className="mt-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-linen p-6 rounded-sm">
                          <div className="flex items-center">
                            <div className="bg-terracotta/10 p-3 rounded-full">
                              <Package className="text-terracotta" size={24} />
                            </div>
                            <div className="ml-4">
                              <p className="text-earth text-sm">Total Products</p>
                              <h3 className="text-charcoal text-2xl font-medium">{totalProducts}</h3>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-linen p-6 rounded-sm">
                          <div className="flex items-center">
                            <div className="bg-terracotta/10 p-3 rounded-full">
                              <ShoppingCart className="text-terracotta" size={24} />
                            </div>
                            <div className="ml-4">
                              <p className="text-earth text-sm">Total Orders</p>
                              <h3 className="text-charcoal text-2xl font-medium">{totalOrders}</h3>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-linen p-6 rounded-sm">
                          <div className="flex items-center">
                            <div className="bg-terracotta/10 p-3 rounded-full">
                              <DollarSign className="text-terracotta" size={24} />
                            </div>
                            <div className="ml-4">
                              <p className="text-earth text-sm">Total Revenue</p>
                              <h3 className="text-charcoal text-2xl font-medium">${totalRevenue.toFixed(2)}</h3>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-linen p-6 rounded-sm">
                          <div className="flex items-center">
                            <div className="bg-terracotta/10 p-3 rounded-full">
                              <Package className="text-terracotta" size={24} />
                            </div>
                            <div className="ml-4">
                              <p className="text-earth text-sm">Low Stock Products</p>
                              <h3 className="text-charcoal text-2xl font-medium">{lowStockProducts}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8">
                        <h2 className="text-charcoal text-xl font-medium mb-4">Recent Orders</h2>
                        
                        {recentOrders.length > 0 ? (
                          <div className="bg-white rounded-sm border border-taupe/20 overflow-hidden">
                            <table className="min-w-full divide-y divide-taupe/20">
                              <thead className="bg-linen">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                    Order ID
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-taupe/20">
                                {recentOrders.map((order) => (
                                  <tr key={order.id} className="hover:bg-linen/30">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                                      {order.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-earth">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'completed' 
                                          ? 'bg-green-100 text-green-800' 
                                          : order.status === 'pending' 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-blue-100 text-blue-800'
                                      }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                                      ${parseFloat(order.total_amount as unknown as string).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="bg-linen p-6 text-center rounded-sm">
                            <p className="text-earth">No orders yet.</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={() => navigate('/seller/products/add')}
                          className="flex items-center bg-terracotta text-white px-4 py-2 rounded-sm hover:bg-umber transition-colors"
                        >
                          <PlusCircle size={18} className="mr-2" />
                          Add New Product
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Products Tab */}
                  {activeTab === 'products' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-charcoal text-xl font-medium">Your Products</h2>
                        <button
                          onClick={() => navigate('/seller/products/add')}
                          className="flex items-center bg-terracotta text-white px-4 py-2 rounded-sm hover:bg-umber transition-colors"
                        >
                          <PlusCircle size={18} className="mr-2" />
                          Add New Product
                        </button>
                      </div>
                      
                      {products.length > 0 ? (
                        <div className="bg-white rounded-sm border border-taupe/20 overflow-hidden">
                          <table className="min-w-full divide-y divide-taupe/20">
                            <thead className="bg-linen">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-taupe/20">
                              {products.map((product) => (
                                <tr key={product.id} className="hover:bg-linen/30">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                                    {product.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth">
                                    ${parseFloat(product.price as unknown as string).toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      product.stock > 10 
                                        ? 'bg-green-100 text-green-800' 
                                        : product.stock > 0 
                                          ? 'bg-yellow-100 text-yellow-800' 
                                          : 'bg-red-100 text-red-800'
                                    }`}>
                                      {product.stock} in stock
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                      onClick={() => navigate(`/seller/products/edit/${product.id}`)}
                                      className="text-terracotta hover:text-umber mr-4"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => navigate(`/product/${product.id}`)}
                                      className="text-earth hover:text-charcoal"
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-linen p-8 text-center rounded-sm">
                          <p className="text-earth mb-4">You haven't added any products yet.</p>
                          <button
                            onClick={() => navigate('/seller/products/add')}
                            className="bg-terracotta text-white px-4 py-2 rounded-sm hover:bg-umber transition-colors"
                          >
                            Add Your First Product
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div>
                      <h2 className="text-charcoal text-xl font-medium mb-6">Your Orders</h2>
                      
                      {orders.length > 0 ? (
                        <div className="bg-white rounded-sm border border-taupe/20 overflow-hidden">
                          <table className="min-w-full divide-y divide-taupe/20">
                            <thead className="bg-linen">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-earth uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-taupe/20">
                              {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-linen/30">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                                    {order.id.substring(0, 8)}...
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      order.status === 'completed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : order.status === 'pending' 
                                          ? 'bg-yellow-100 text-yellow-800' 
                                          : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                                    ${parseFloat(order.total_amount as unknown as string).toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                      onClick={() => navigate(`/seller/orders/${order.id}`)}
                                      className="text-terracotta hover:text-umber"
                                    >
                                      View Details
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="bg-linen p-6 text-center rounded-sm">
                          <p className="text-earth">No orders yet.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div>
                      <h2 className="text-charcoal text-xl font-medium mb-6">Product Reviews</h2>
                      
                      <div className="bg-linen p-6 text-center rounded-sm">
                        <Star className="mx-auto text-terracotta mb-2" size={24} />
                        <p className="text-earth">Coming soon! You'll be able to view and respond to customer reviews here.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Analytics Tab */}
                  {activeTab === 'analytics' && (
                    <div>
                      <h2 className="text-charcoal text-xl font-medium mb-6">Sales Analytics</h2>
                      
                      <div className="bg-linen p-6 text-center rounded-sm">
                        <BarChart3 className="mx-auto text-terracotta mb-2" size={24} />
                        <p className="text-earth">Coming soon! Detailed analytics about your sales and store performance will appear here.</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;
