
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Clock } from 'lucide-react';
import { ProductComment } from '@/models/internal/ProductComments';

interface CommentSystemProps {
  productId: string;
  comments: ProductComment[];
  userRole: 'admin' | 'seller';
  onAddComment: (content: string, commentType?: string, parentId?: string) => void;
  onResolveComment?: (commentId: string) => void;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  productId,
  comments,
  userRole,
  onAddComment,
  onResolveComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, 'feedback');
      setNewComment('');
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(replyContent, 'response', parentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const getCommentTypeColor = (commentType: string) => {
    switch (commentType) {
      case 'feedback':
        return 'bg-blue-100 text-blue-800';
      case 'response':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'text-red-600 font-semibold' : 'text-blue-600 font-semibold';
  };

  const sortedComments = comments
    .filter(comment => !comment.parentCommentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getReplies = (parentId: string) => 
    comments
      .filter(comment => comment.parentCommentId === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Product Review Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Comment */}
        <div className="space-y-3">
          <Textarea
            placeholder={`Add ${userRole === 'admin' ? 'feedback' : 'response'} for this product...`}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmitComment} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Add {userRole === 'admin' ? 'Feedback' : 'Response'}
          </Button>
        </div>

        {/* Comments List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedComments.map((comment) => {
            const replies = getReplies(comment.id);
            
            return (
              <div key={comment.id} className="space-y-2">
                {/* Main Comment */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {comment.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={getRoleColor(comment.userRole)}>
                          {comment.userName} ({comment.userRole})
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{comment.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getCommentTypeColor(comment.commentType)}>
                      {comment.commentType}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReplyingTo(comment.id)}
                    >
                      Reply
                    </Button>
                    {onResolveComment && comment.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onResolveComment(comment.id)}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="ml-8 space-y-2">
                    {replies.map((reply) => (
                      <div key={reply.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {reply.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className={`text-sm ${getRoleColor(reply.userRole)}`}>
                            {reply.userName} ({reply.userRole})
                          </p>
                          <span className="text-xs text-gray-500">
                            {reply.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="ml-8 space-y-2">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                      >
                        Submit Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {comments.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No comments yet. Start the conversation!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSystem;
