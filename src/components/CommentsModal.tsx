
import React from 'react';
import { X } from 'lucide-react';
import CommentSection from './CommentSection';
import { ProductReview } from '../models/internal/Product';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks/use-mobile';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  comments: ProductReview[];
  onAddComment: (productId: string, comment: string) => Promise<void>;
  onReplyToComment: (commentId: string, reply: string) => Promise<void>;
  productName: string;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  productId,
  comments,
  onAddComment,
  onReplyToComment,
  productName,
}) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-2xl mx-4 ${
          isMobile 
            ? 'h-3/4 rounded-t-xl' 
            : 'max-h-[80vh] rounded-xl'
        } overflow-hidden`}
        style={{ backgroundColor: theme.background }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: theme.border }}
        >
          <h2 className="text-lg font-semibold" style={{ color: theme.foreground }}>
            Comments on {productName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            style={{ color: theme.foreground }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-4">
          <CommentSection
            productId={productId}
            comments={comments}
            onAddComment={onAddComment}
            onReplyToComment={onReplyToComment}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
