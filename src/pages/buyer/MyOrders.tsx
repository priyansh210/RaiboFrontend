import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { OrderService } from '../../services/OrderService';
import { Order, OrderStatus } from '../../models/internal/Order';
import { toast } from '@/hooks/use-toast';
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const MyOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const userOrders = await OrderService.getUserOrders();
      // Sort orders by date (newest first)
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const recentOrders = orders.slice(0, 3);
  const allOrders = orders;

  if (!user) return null;

  return (
    <Layout>
      <div className="page-transition min-h-screen bg-background py-20">
        <div className="container-custom">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/account')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Account
            </Button>
          </div>

          <div className="bg-card p-8 rounded-sm shadow-sm border border-border">
            <div className="mb-6">
              <h1 className="font-playfair text-3xl text-foreground mb-2">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your orders</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">Oops! Something went wrong</p>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchOrders} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Try Again
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">No orders yet</p>
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Button 
                  onClick={() => navigate('/browse')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="recent">Recent Orders</TabsTrigger>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="recent">
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium text-foreground mb-4">Latest Orders</h2>
                    {recentOrders.map((order) => (
                      <Card key={order.id} className="border border-border hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(order.status)}
                                <div>
                                  <p className="font-medium text-foreground">Order #{order.id}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </span>
                                <span className="font-medium text-foreground">
                                  ${order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/order/${order.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="all">
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium text-foreground mb-4">Order History</h2>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-foreground">Order ID</TableHead>
                            <TableHead className="text-foreground">Date</TableHead>
                            <TableHead className="text-foreground">Status</TableHead>
                            <TableHead className="text-foreground">Items</TableHead>
                            <TableHead className="text-foreground">Total</TableHead>
                            <TableHead className="text-foreground">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allOrders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(order.status)}
                                  <Badge className={getStatusColor(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </TableCell>
                              <TableCell className="font-medium text-foreground">
                                ${order.totalAmount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" onClick={() => navigate(`/order/${order.id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyOrders;
