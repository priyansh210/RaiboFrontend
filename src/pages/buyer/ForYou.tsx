import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import InstagramStylePost from '../../components/InstagramStylePost';
import CommentsModal from '../../components/CommentsModal';
import { getAllProducts, addComment, replyToComment } from '../../services/ProductService';
import { Product } from '../../models/internal/Product';
import { apiService } from '../../services/ApiService';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '../../hooks/use-mobile';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ForYou = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [commentsModal, setCommentsModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    comments: any[];
  }>({ isOpen: false, productId: '', productName: '', comments: [] });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await getAllProducts();
      
      // Generate interactions for each product
      const productsWithInteractions = productsData.map(product => ({
        ...product,
        interactions: {
          likes: Math.floor(Math.random() * 500) + 10,
          shares: Math.floor(Math.random() * 100) + 5,
          comments: [
            {
              id: `${product.id}-comment-1`,
              userId: 'user1',
              userName: 'Sarah Chen',
              rating: 5,
              comment: 'Absolutely love this! Quality is amazing and arrived quickly.',
              createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
              likes: Math.floor(Math.random() * 20),
              userHasLiked: false,
            },
            {
              id: `${product.id}-comment-2`,
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
        }
      }));
      
      setProducts(productsWithInteractions);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (productId: string) => {
    try {
      await apiService.handleLike(productId);
      
      setProducts(prevProducts => prevProducts.map(product => {
        if (product.id === productId) {
          const currentLikes = product.interactions?.likes || 0;
          const userHasLiked = product.interactions?.userHasLiked || false;
          return {
            ...product,
            interactions: {
              ...product.interactions!,
              likes: userHasLiked ? currentLikes - 1 : currentLikes + 1,
              userHasLiked: !userHasLiked,
            }
          };
        }
        return product;
      }));
      
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
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name}`,
        url: `${window.location.origin}/product/${productId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${productId}`);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard.",
      });
    }
  };

  const handleComment = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setCommentsModal({
        isOpen: true,
        productId,
        productName: product.name,
        comments: product.interactions?.comments || [],
      });
    }
  };

  const handleAddComment = async (productId: string, comment: string) => {
    try {
      const response = await addComment(productId, comment);
      
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
      
      setProducts(prevProducts => prevProducts.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            interactions: {
              ...product.interactions!,
              comments: [newComment, ...product.interactions!.comments],
            }
          };
        }
        return product;
      }));
      
      setCommentsModal(prev => ({
        ...prev,
        comments: [newComment, ...prev.comments],
      }));
      
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const handleReplyToComment = async (commentId: string, reply: string) => {
    try {
      await replyToComment(commentId, reply);
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
            <h2 className="text-xl text-charcoal">Loading your feed...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={`min-h-screen ${isMobile ? 'bg-black' : 'bg-gray-50'} ${isMobile ? 'py-0' : 'py-6 md:py-10'}`}>
        <div className={`${isMobile ? '' : 'container mx-auto px-4 max-w-4xl'}`}>
          {/* Desktop Header */}
          {!isMobile && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-charcoal mb-2">For You</h1>
                <p className="text-earth">Discover products curated just for you</p>
              </div>
              <Link to="/my-rooms">
                <Button className="bg-terracotta hover:bg-umber text-white">
                  <Home size={20} className="mr-2" />
                  My Rooms
                </Button>
              </Link>
            </div>
          )}

          {/* Products Feed */}
          <div className={isMobile ? 'space-y-0' : 'space-y-6'}>
            {products.map((product) => (
              <InstagramStylePost
                key={product.id}
                product={product}
                onLike={handleLike}
                onShare={handleShare}
                onComment={handleComment}
              />
            ))}
          </div>

          {/* Comments Modal */}
          {commentsModal.isOpen && (
            <CommentsModal
              isOpen={commentsModal.isOpen}
              onClose={() => setCommentsModal({ isOpen: false, productId: '', productName: '', comments: [] })}
              productId={commentsModal.productId}
              comments={commentsModal.comments}
              onAddComment={handleAddComment}
              onReplyToComment={handleReplyToComment}
              productName={commentsModal.productName}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForYou;
