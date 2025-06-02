
import { ProductReview, ProductInteraction } from '../models/internal/Product';

// Dummy data service for product interactions
export class ProductInteractionService {
  // Simulate API delay
  private static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate dummy reviews for a product
  static generateDummyReviews(productId: string): ProductReview[] {
    const users = [
      'Sarah Chen', 'Mike Johnson', 'Emma Williams', 'David Brown', 'Lisa Garcia',
      'Tom Wilson', 'Anna Martinez', 'James Davis', 'Sophie Taylor', 'Alex Rodriguez'
    ];

    const comments = [
      'Absolutely love this! Quality is amazing and arrived quickly.',
      'Great product, exactly as described. Highly recommend!',
      'Perfect addition to my home. Very satisfied with the purchase.',
      'Excellent quality and fast shipping. Will buy again!',
      'Beautiful design and well-made. Worth every penny.',
      'Good value for money. Happy with my purchase.',
      'Nice product but took a while to arrive.',
      'Exceeded my expectations. Great customer service too!',
      'Looks even better in person. Very pleased!',
      'Solid build quality. Exactly what I was looking for.'
    ];

    const reviewCount = Math.floor(Math.random() * 8) + 2; // 2-10 reviews
    const reviews: ProductReview[] = [];

    for (let i = 0; i < reviewCount; i++) {
      reviews.push({
        id: `${productId}-review-${i + 1}`,
        userId: `user-${i + 1}`,
        userName: users[Math.floor(Math.random() * users.length)],
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars mostly
        comment: comments[Math.floor(Math.random() * comments.length)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
        likes: Math.floor(Math.random() * 25),
        userHasLiked: Math.random() > 0.8, // 20% chance user liked
      });
    }

    return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Generate dummy interaction data
  static generateDummyInteractions(productId: string): ProductInteraction {
    return {
      likes: Math.floor(Math.random() * 500) + 10,
      shares: Math.floor(Math.random() * 100) + 5,
      comments: this.generateDummyReviews(productId),
      userHasLiked: Math.random() > 0.7, // 30% chance user liked
      userHasShared: Math.random() > 0.9, // 10% chance user shared
    };
  }

  // Simulate like/unlike a product
  static async toggleLike(productId: string, currentInteraction: ProductInteraction): Promise<ProductInteraction> {
    await this.delay(300);
    
    const isLiked = currentInteraction.userHasLiked;
    return {
      ...currentInteraction,
      likes: isLiked ? currentInteraction.likes - 1 : currentInteraction.likes + 1,
      userHasLiked: !isLiked,
    };
  }

  // Simulate sharing a product
  static async shareProduct(productId: string, currentInteraction: ProductInteraction): Promise<ProductInteraction> {
    await this.delay(200);
    
    return {
      ...currentInteraction,
      shares: currentInteraction.shares + 1,
      userHasShared: true,
    };
  }

  // Simulate adding a comment/review
  static async addComment(
    productId: string, 
    comment: string, 
    rating: number,
    currentInteraction: ProductInteraction
  ): Promise<ProductInteraction> {
    await this.delay(500);
    
    const newComment: ProductReview = {
      id: `${productId}-comment-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      rating,
      comment,
      createdAt: new Date(),
      likes: 0,
      userHasLiked: false,
    };

    return {
      ...currentInteraction,
      comments: [newComment, ...currentInteraction.comments],
    };
  }

  // Simulate liking a comment
  static async toggleCommentLike(
    commentId: string, 
    currentInteraction: ProductInteraction
  ): Promise<ProductInteraction> {
    await this.delay(200);
    
    const updatedComments = currentInteraction.comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.userHasLiked;
        return {
          ...comment,
          likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          userHasLiked: !isLiked,
        };
      }
      return comment;
    });

    return {
      ...currentInteraction,
      comments: updatedComments,
    };
  }
}
