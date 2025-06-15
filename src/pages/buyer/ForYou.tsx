import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import CommentsModal from '../../components/CommentsModal';
import { fetchProducts, addComment, replyToComment } from '../../services/ProductService';
import { Product } from '../../models/internal/Product';
import { apiService } from '../../services/ApiService';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '../../hooks/use-mobile';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstagramStylePost from '../../components/InstagramStylePost';

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
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    setIsLoading(true);
    try {
      const productsData = await fetchProducts();
      
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
      // We are not calling the API to make the UI feel faster
      // await apiService.handleLike(productId);
      
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl text-foreground">Loading your feed...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (isMobile) {
    return (
      <>
        {/* Mobile Reels View - No Layout wrapper for full screen */}
        <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
          <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
            {products.map((product) => (
              <div key={product.id} className="h-screen w-full snap-start">
                <InstagramStylePost
                  product={product}
                  onLike={handleLike}
                  onShare={handleShare}
                  onComment={handleComment}
                />
              </div>
            ))}
          </div>
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
      </>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">For You</h1>
              <p className="text-muted-foreground">Discover products curated just for you</p>
            </div>
            <Link to="/my-rooms">
              <Button>
                <Home size={20} className="mr-2" />
                My Rooms
              </Button>
            </Link>
          </div>

          {/* Pinterest-style Masonry Grid */}
          <div className={`columns-2 ${isMobile ? 'gap-3' : 'md:columns-3 lg:columns-4 xl:columns-5 gap-4'} space-y-4`}>
            {products.map((product) => (
              <div key={product.id} className="break-inside-avoid mb-4">
                <ProductCard product={product} />
              </div>
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
