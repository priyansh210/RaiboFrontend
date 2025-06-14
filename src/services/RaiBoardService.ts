import { RaiBoard, RaiBoardProduct, RaiBoardTextElement, RaiBoardCollaborator, RaiBoardInvite } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
import { apiService } from './ApiService';

class RaiBoardService {
  // Get all user's boards
  async getUserBoards(userId: string): Promise<RaiBoard[]> {
    // Dummy implementation - replace with real API later
    const response = await apiService.getBoards() as { data: RaiBoard[] };
    return response.data.map(board => ({
      ...board,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt),
    })) as RaiBoard[];
  }

  // Get board by ID
  async getBoardById(boardId: string): Promise<RaiBoard> {
    
    const response = await apiService.getBoardById(boardId) as { data: RaiBoard };
    const board = response.data;
    if (!board) {
      throw new Error('Board not found');
    }
    return {
      ...board,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt),
    } as RaiBoard;

  }

  // Create new board
  async createBoard(boardData: {
    name: string,
    description: string,
    isPublic: boolean
  } ): Promise<RaiBoard> {
    const response = await apiService.createBoard(boardData) as { data: RaiBoard };
    const board = response.data;
    return {...board,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt),
    } as RaiBoard;
  }

  async saveBoard(raiboard: RaiBoard): Promise<void> {
    const response = await apiService.updateBoard(raiboard.id, raiboard) as { data: RaiBoard };
    console.log('Board saved:', response.data);
    return ;
  }

  // Add text element to board
  async addTextElementToBoard(boardId: string, type: 'heading' | 'paragraph', position: { x: number; y: number }): Promise<RaiBoardTextElement> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'text-' + Date.now(),
          type,
          content: '',
          position,
          size: { width: 200, height: type === 'heading' ? 50 : 100 },
          zIndex: 1,
          fontSize: type === 'heading' ? 24 : 16,
          fontWeight: type === 'heading' ? 'bold' : 'normal',
          color: '#000000',
        });
      }, 200);
    });
  }

  // Update text element
  async updateTextElement(boardId: string, elementId: string, updates: Partial<RaiBoardTextElement>): Promise<void> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updated text element:', { boardId, elementId, updates });
        resolve();
      }, 100);
    });
  }

  // Remove text element from board
  async removeTextElementFromBoard(boardId: string, elementId: string): Promise<void> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Removed text element from board:', { boardId, elementId });
        resolve();
      }, 200);
    });
  }

  // Add product to board
  async addProductToBoard(boardId: string, product: Product, position: { x: number; y: number }): Promise<RaiBoardProduct> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'board-product-' + Date.now(),
          productId: product.id,
          productName: product.name,
          productImage: product.displayImage || product.imageUrls[0] || '/placeholder.svg',
          productPrice: product.price,
          position,
          size: { width: 200, height: 200 },
          zIndex: 1,
          rotation: 0,
        });
      }, 200);
    });
  }

  // Remove product from board
  async removeProductFromBoard(boardId: string, productId: string): Promise<void> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Removed product from board:', { boardId, productId });
        resolve();
      }, 200);
    });
  }

  // Invite collaborator
  async inviteCollaborator(boardId: string, email: string, role: 'editor' | 'viewer'): Promise<RaiBoardInvite> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'invite-' + Date.now(),
          boardId,
          inviterName: 'John Doe',
          inviteeEmail: email,
          role,
          status: 'pending',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date(),
        });
      }, 300);
    });
  }

  // Get board collaborators
  async getBoardCollaborators(boardId: string): Promise<RaiBoardCollaborator[]> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getDummyCollaborators());
      }, 200);
    });
  }

  private getDummyCollaborators(): RaiBoardCollaborator[] {
    return [
      {
        id: 'collab-1',
        userName: 'Jane Smith',
        userAvatar: '/placeholder.svg',
        role: 'editor',
        joinedAt: new Date('2024-01-20'),
        isOnline: true,
      },
      {
        id: 'collab-2',
        userName: 'Mike Johnson',
        role: 'viewer',
        joinedAt: new Date('2024-02-01'),
        isOnline: false,
      },
    ];
  }
}

export const raiBoardService = new RaiBoardService();
