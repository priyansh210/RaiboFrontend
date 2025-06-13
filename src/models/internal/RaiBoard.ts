
export interface RaiBoardProduct {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  rotation: number;
}

export interface RaiBoardTextElement {
  id: string;
  type: 'heading' | 'paragraph';
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  zIndex: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: string;
}

export interface RaiBoardCollaborator {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  isOnline: boolean;
}

export interface RaiBoard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  ownerName: string;
  products: RaiBoardProduct[];
  textElements: RaiBoardTextElement[];
  collaborators: RaiBoardCollaborator[];
  settings: {
    gridSize: number;
    showGrid: boolean;
    allowOverlap: boolean;
    maxZoom: number;
    minZoom: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface RaiBoardInvite {
  id: string;
  boardId: string;
  inviterName: string;
  inviteeEmail: string;
  role: 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: Date;
  createdAt: Date;
}
