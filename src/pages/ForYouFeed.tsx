
import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductReview } from '@/models/internal/Product';
import InstagramStylePost from '../components/InstagramStylePost';
import CommentsModal from '../components/CommentsModal';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ForYouFeed = () => {
  const { products, isLoading, handleLike, handleShare, handleAddComment, handleReplyToComment } = useProducts();
  const navigate = useNavigate();
  const { startIndex } = useParams();
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

  const startIdx = startIndex ? parseInt(startIndex) : 0;
  const orderedProducts = [...products.slice(startIdx), ...products.slice(0, startIdx)];

  if (isLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Reels View with Navbar */}
      <div className="h-screen w-screen overflow-hidden bg-background">
        {/* Header with back button */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => navigate('/for-you')}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">For You</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="fixed top-16 bottom-0 left-0 right-0 overflow-y-auto snap-y snap-mandatory">
          {orderedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="h-full w-full snap-start flex-shrink-0">
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
};

export default ForYouFeed;
