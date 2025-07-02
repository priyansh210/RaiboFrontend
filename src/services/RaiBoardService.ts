import { RaiBoard, RaiBoardProduct, RaiBoardTextElement, RaiBoardCollaborator, RaiBoardInvite } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
import { apiService } from './ApiService';

class RaiBoardService {
  // Get all user's boards
  async getUserBoards(): Promise<RaiBoard[]> {
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

  async addProductToBoard(boardId: string, productId: string){
    const response = await apiService.addProductToBoard(boardId, productId) as { success: any };
    return response.success;
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

  // Create invitation to join a RaiBoard
  async inviteCollaborator(boardId: string, inviteeEmail: string, role: 'editor' | 'viewer'): Promise<RaiBoardInvite> {
    const response = await apiService.createBoardInvite(boardId, inviteeEmail, role) as { data: RaiBoardInvite };
    return response.data;
  }

  // Accept invitation to join a RaiBoard
  async acceptBoardInvite(inviteId: string): Promise<void> {
    await apiService.acceptBoardInvite(inviteId);
  }

  // Decline invitation to join a RaiBoard
  async declineBoardInvite(inviteId: string): Promise<void> {
    await apiService.declineBoardInvite(inviteId);
  }

  async getAllBoardInvite(): Promise<RaiBoardInvite[]> {
    const response = await apiService.getAllBoardInvite() as { data: RaiBoardInvite[] };
    return response.data;
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

  // Change collaborator role
  async changeCollaboratorRole(boardId: string, userId: string, newRole: 'editor' | 'viewer'): Promise<void> {
    await apiService.changeCollaboratorRole(boardId, userId, newRole);
  }
}

export const raiBoardService = new RaiBoardService();
