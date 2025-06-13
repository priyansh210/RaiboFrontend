
import { RaiBoard, RaiBoardProduct, RaiBoardCollaborator, RaiBoardInvite } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';

class RaiBoardService {
  // Get all user's boards
  async getUserBoards(userId: string): Promise<RaiBoard[]> {
    // Dummy implementation - replace with real API later
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'board-1',
            name: 'Living Room Design',
            description: 'Planning our living room renovation',
            ownerId: 'user-1',
            ownerName: 'John Doe',
            products: this.getDummyBoardProducts(),
            collaborators: this.getDummyCollaborators(),
            settings: {
              gridSize: 20,
              showGrid: true,
              allowOverlap: true,
              maxZoom: 3,
              minZoom: 0.5,
            },
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date(),
            isPublic: false,
          },
          {
            id: 'board-2',
            name: 'Kitchen Remodel',
            description: 'Modern kitchen design ideas',
            ownerId: 'user-1',
            ownerName: 'John Doe',
            products: [],
            collaborators: [],
            settings: {
              gridSize: 20,
              showGrid: true,
              allowOverlap: true,
              maxZoom: 3,
              minZoom: 0.5,
            },
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date(),
            isPublic: true,
          },
        ]);
      }, 500);
    });
  }

  // Get board by ID
  async getBoardById(boardId: string): Promise<RaiBoard> {
    // Dummy implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (boardId === 'board-1') {
          resolve({
            id: 'board-1',
            name: 'Living Room Design',
            description: 'Planning our living room renovation',
            ownerId: 'user-1',
            ownerName: 'John Doe',
            products: this.getDummyBoardProducts(),
            collaborators: this.getDummyCollaborators(),
            settings: {
              gridSize: 20,
              showGrid: true,
              allowOverlap: true,
              maxZoom: 3,
              minZoom: 0.5,
            },
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date(),
            isPublic: false,
          });
        } else {
          reject(new Error('Board not found'));
        }
      }, 300);
    });
  }

  // Create new board
  async createBoard(boardData: Partial<RaiBoard>): Promise<RaiBoard> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'board-' + Date.now(),
          name: boardData.name || 'Untitled Board',
          description: boardData.description || '',
          ownerId: 'user-1',
          ownerName: 'John Doe',
          products: [],
          collaborators: [],
          settings: {
            gridSize: 20,
            showGrid: true,
            allowOverlap: true,
            maxZoom: 3,
            minZoom: 0.5,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublic: boardData.isPublic || false,
        });
      }, 300);
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

  // Update product position
  async updateProductPosition(boardId: string, productId: string, position: { x: number; y: number }, zIndex?: number): Promise<void> {
    // Dummy implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Updated product position:', { boardId, productId, position, zIndex });
        resolve();
      }, 100);
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

  private getDummyBoardProducts(): RaiBoardProduct[] {
    return [
      {
        id: 'bp-1',
        productId: 'prod-1',
        productName: 'Modern Sofa',
        productImage: '/placeholder.svg',
        productPrice: 1299.99,
        position: { x: 100, y: 150 },
        size: { width: 200, height: 200 },
        zIndex: 1,
        rotation: 0,
      },
      {
        id: 'bp-2',
        productId: 'prod-2',
        productName: 'Coffee Table',
        productImage: '/placeholder.svg',
        productPrice: 599.99,
        position: { x: 350, y: 200 },
        size: { width: 150, height: 150 },
        zIndex: 2,
        rotation: 15,
      },
    ];
  }

  private getDummyCollaborators(): RaiBoardCollaborator[] {
    return [
      {
        id: 'collab-1',
        userId: 'user-2',
        userName: 'Jane Smith',
        userAvatar: '/placeholder.svg',
        role: 'editor',
        joinedAt: new Date('2024-01-20'),
        isOnline: true,
      },
      {
        id: 'collab-2',
        userId: 'user-3',
        userName: 'Mike Johnson',
        role: 'viewer',
        joinedAt: new Date('2024-02-01'),
        isOnline: false,
      },
    ];
  }
}

export const raiBoardService = new RaiBoardService();
