
import { useState, useEffect } from 'react';
import { Product } from '../models/internal/Product';
import { ProductReview } from '../models/internal/Product';
import { productService } from '../services/ProductService';
import { toast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductsData = async () => {
      setIsLoading(true);
      try {
        const productsData = await productService.fetchProducts();
        
        const productsWithInteractions = productsData.map(product => ({
          ...product,
          interactions: {
            likes: Math.floor(Math.random() * 500) + 10,
            shares: Math.floor(Math.random() * 100) + 5,
            views: Math.floor(Math.random() * 5000) + 100,
            orderCount: Math.floor(Math.random() * 200) + 5,
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

    fetchProductsData();
  }, []);

  const handleLike = async (productId: string) => {
    // We are not calling an API to make the UI feel faster
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

  const handleAddComment = async (productId: string, comment: string): Promise<ProductReview | undefined> => {
    try {
      const response = await productService.addComment(productId, comment);
      
      const newComment: ProductReview = {
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
      
      return newComment;
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    }
  };

  const handleReplyToComment = async (commentId: string, reply: string) => {
    try {
      await productService.replyToComment(commentId, reply);
      // Here you would typically update the state to show the reply
      toast({
        title: "Success",
        description: "Your reply has been posted.",
      });
    } catch (error) {
      console.error('Failed to reply to comment:', error);
      toast({
        title: "Error",
        description: "Failed to post reply.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { products, isLoading, handleLike, handleShare, handleAddComment, handleReplyToComment };
};
