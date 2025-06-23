import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { OrderService } from '@/services/OrderService';
import { Order } from '@/models/internal/Order';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { apiService } from '@/services/ApiService';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    OrderService.getOrderById(orderId)
      .then(async (order) => {
        if (!order) {
          setOrder(null);
          setProducts([]);
          return;
        }
        // Fetch product details for each item and flatten to a list of products
        const productsList = await Promise.all(
          order.items.map(async (item) => {
            try {
              const product = await apiService.getProductById(item.productId);
              return {
                ...product,
                quantity: item.quantity,
                itemStatus: item.itemStatus,
                displayImage: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.svg',
              };
            } catch {
              return {
                id: item.productId,
                name: 'Product',
                displayImage: '/placeholder.svg',
                price: 0,
                quantity: item.quantity,
                itemStatus: item.itemStatus,
              };
            }
          })
        );
        setOrder(order);
        setProducts(productsList);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading order details...</div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-foreground">Order not found.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container-custom max-w-2xl">
          <button
            className="flex items-center mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
          </button>
          <div className="p-8 rounded-lg shadow-sm bg-card border border-border">
            <h1 className="font-playfair text-2xl mb-2 text-foreground">Order #{order.id}</h1>
            <div className="mb-4 text-muted-foreground">
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
            </div>
            <div className="mb-6 flex flex-wrap gap-4 items-center">
              <Badge className="text-base px-3 py-1">
                Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">${order.totalAmount.toFixed(2)}</span></span>
            </div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Products</h2>
            <div className="divide-y" style={{ borderColor: theme.border }}>
              {products.map((product) => (
                <div key={product.id} className="flex items-center py-3 gap-4">
                  <img src={product.displayImage || '/placeholder.svg'} alt={product.name || ''} className="w-14 h-14 object-cover rounded bg-linen" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-foreground">{product.name || 'Product'}</div>
                    <div className="text-sm text-muted-foreground">Qty: {product.quantity}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-foreground">${product.price?.toFixed(2) ?? '0.00'}</span>
                    <Badge className="mt-1 text-xs">
                      {product.itemStatus || 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
