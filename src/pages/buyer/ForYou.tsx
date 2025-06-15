
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import CommentsModal from '../../components/CommentsModal';
import { useIsMobile } from '../../hooks/use-mobile';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InstagramStylePost from '../../components/InstagramStylePost';
import Navbar from '../../components/Navbar';
import { useProducts } from '../../hooks/useProducts';
import { ProductReview } from '@/models/internal/Product';

const ForYou = () => {
  const { products, isLoading, handleLike, handleShare, handleAddComment, handleReplyToComment } = useProducts();
  const isMobile = useIsMobile();
  const [commentsModal, setCommentsModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
    comments: ProductReview[];
  }>({ isOpen: false, productId: '', productName: '', comments: [] });

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

  const handleAddCommentForModal = async (productId: string, comment: string) => {
    const newComment = await handleAddComment(productId, comment);
    if (newComment) {
      setCommentsModal(prev => ({
        ...prev,
        comments: [newComment, ...prev.comments],
      }));
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
        {/* Mobile Reels View with Navbar */}
        <div className="h-screen w-screen overflow-hidden">
          <Navbar />
          <div className="fixed top-16 bottom-0 left-0 right-0 overflow-y-auto snap-y snap-mandatory bg-black">
            {products.map((product) => (
              <div key={product.id} className="h-full w-full snap-start flex-shrink-0">
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
            onAddComment={handleAddCommentForModal}
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
              onAddComment={handleAddCommentForModal}
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
