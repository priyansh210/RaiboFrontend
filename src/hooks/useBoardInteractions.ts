import { useRaiBoard } from '@/context/RaiBoardContext';
import { useToast } from '@/hooks/use-toast';
import { RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
import { raiBoardService } from '@/services/RaiBoardService';

export const useBoardInteractions = () => {
  const { state, dispatch, addProductLocally, addTextElementLocally } = useRaiBoard();
  const { toast } = useToast();

  const handleAddTextElement = (type: 'heading' | 'paragraph') => {
    addTextElementLocally(type, { x: 200, y: 200 });
    toast({
      title: 'Success',
      description: `${type === 'heading' ? 'Heading' : 'Paragraph'} added to board`,
    });
  };

  const handleTextElementMove = (elementId: string, position: { x: number; y: number }, zIndex?: number) => {
    dispatch({ type: 'UPDATE_TEXT_ELEMENT_POSITION', payload: { elementId, position, zIndex } });
  };

  const handleTextElementResize = (elementId: string, size: { width: number; height: number }) => {
    dispatch({ type: 'UPDATE_TEXT_ELEMENT_SIZE', payload: { elementId, size } });
  };

  const handleTextElementUpdate = (elementId: string, updates: Partial<RaiBoardTextElement>) => {
    dispatch({ type: 'UPDATE_TEXT_ELEMENT', payload: { elementId, updates } });
  };

  const handleTextElementRemove = (elementId: string) => {
    dispatch({ type: 'REMOVE_TEXT_ELEMENT', payload: elementId });
    toast({ title: 'Success', description: 'Text element removed from board' });
  };

  const handleAddProductToBoard = (product: Product) => {
    addProductLocally(product, { x: 100, y: 100 });
    toast({ title: 'Success', description: 'Product added to board' });
  };

  const handleProductMove = (productId: string, position: { x: number; y: number }, zIndex?: number) => {
    dispatch({ type: 'UPDATE_PRODUCT_POSITION', payload: { productId, position, zIndex } });
  };

  const handleProductResize = (productId: string, size: { width: number; height: number }) => {
    dispatch({ type: 'UPDATE_PRODUCT_SIZE', payload: { productId, size } });
  };

  const handleProductRemove = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
    toast({ title: 'Success', description: 'Product removed from board' });
  };
  
  const handleInviteCollaborator = async (email: string, role: 'editor' | 'viewer') => {
    if (!state.board) return;
    try {
      await raiBoardService.inviteCollaborator(state.board.id, email, role);
      toast({ title: 'Success', description: `Invitation sent to ${email}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send invitation', variant: 'destructive' });
    }
  };

  const handleChangeCollaboratorRole = async (userId: string, newRole: 'editor' | 'viewer') => {
    if (!state.board) return;
    try {
      await raiBoardService.changeCollaboratorRole(state.board.id, userId, newRole);
      // Update local state immediately after successful API call
      dispatch({ type: 'UPDATE_COLLABORATOR_ROLE', payload: { userId, newRole } });
      toast({ title: 'Role updated', description: 'Collaborator role updated successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
      throw error;
    }
  };

  return {
    handleAddTextElement,
    handleTextElementMove,
    handleTextElementResize,
    handleTextElementUpdate,
    handleTextElementRemove,
    handleAddProductToBoard,
    handleProductMove,
    handleProductResize,
    handleProductRemove,
    handleInviteCollaborator,
    handleChangeCollaboratorRole,
  };
};
