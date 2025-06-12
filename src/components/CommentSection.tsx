
import React, { useState } from 'react';
import { MessageCircle, Reply, Send } from 'lucide-react';
import { ProductReview } from '../models/internal/Product';
import { useTheme } from '../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { apiService } from '@/services/ApiService';
import { toast } from '@/hooks/use-toast';

interface CommentSectionProps {
  productId: string;
  comments: ProductReview[];
  onAddComment: (productId: string, comment: string) => Promise<void>;
  onReplyToComment: (commentId: string, reply: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  productId,
  comments,
  onAddComment,
  onReplyToComment,
}) => {
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(productId, newComment);
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onReplyToComment(commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully.",
      });
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add new comment */}
      <Card style={{ backgroundColor: theme.card }}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <MessageCircle size={20} style={{ color: theme.primary }} className="mt-1" />
            <div className="flex-1 space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[80px]"
                style={{ 
                  backgroundColor: theme.background,
                  color: theme.foreground,
                  borderColor: theme.border 
                }}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="ml-auto"
                style={{ backgroundColor: theme.primary }}
              >
                <Send size={16} className="mr-2" />
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} style={{ backgroundColor: theme.card }}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: theme.foreground }}>
                      {comment.userName}
                    </h4>
                    <p className="text-sm" style={{ color: theme.mutedForeground }}>
                      {comment.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <p style={{ color: theme.foreground }}>{comment.comment}</p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center space-x-1 text-sm hover:opacity-80"
                    style={{ color: theme.primary }}
                  >
                    <Reply size={14} />
                    <span>Reply</span>
                  </button>
                </div>

                {/* Reply input */}
                {replyingTo === comment.id && (
                  <div className="ml-6 space-y-3">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="min-h-[60px]"
                      style={{ 
                        backgroundColor: theme.background,
                        color: theme.foreground,
                        borderColor: theme.border 
                      }}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyText.trim() || isSubmitting}
                        size="sm"
                        style={{ backgroundColor: theme.primary }}
                      >
                        {isSubmitting ? 'Replying...' : 'Reply'}
                      </Button>
                      <Button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
