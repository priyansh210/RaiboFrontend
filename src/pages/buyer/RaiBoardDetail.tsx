
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
import { raiBoardService } from '@/services/RaiBoardService';
import { RaiBoardCanvas } from '@/components/raiboards/RaiBoardCanvas';
import { RaiBoardToolbar } from '@/components/raiboards/RaiBoardToolbar';
import { CollaboratorPanel } from '@/components/raiboards/CollaboratorPanel';
import { SaveConfirmationDialog } from '@/components/raiboards/SaveConfirmationDialog';
import { RaiBoardProvider, useRaiBoard } from '@/context/RaiBoardContext';
import { useToast } from '@/hooks/use-toast';
import { RaiBoardHeader } from '@/components/raiboards/RaiBoardHeader';
import { ProductSearchDialog } from '@/components/raiboards/ProductSearchDialog';
import { RaiBoardLoading } from '@/components/raiboards/RaiBoardLoading';
import { RaiBoardNotFound } from '@/components/raiboards/RaiBoardNotFound';

const RaiBoardDetailContent: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch, addProductLocally, addTextElementLocally } = useRaiBoard();

  const [saving, setSaving] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [userRole] = useState<'owner' | 'editor' | 'viewer'>('owner');

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  // Prevent navigation when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  const loadBoard = async () => {
    if (!boardId) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const boardData = await raiBoardService.getBoardById(boardId);
      dispatch({ type: 'SET_BOARD', payload: boardData });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load board',
        variant: 'destructive',
      });
      navigate('/raiboards');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleSaveBoard = async () => {
    if (!state.board) return;
    
    try {
      setSaving(true);
      await raiBoardService.saveBoard(state.board);
      dispatch({ type: 'MARK_SAVED' });
      toast({
        title: 'Success',
        description: 'Board saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save board',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNavigateWithConfirmation = (path: string) => {
    if (state.hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowSaveConfirmation(true);
    } else {
      navigate(path);
    }
  };

  const handleSaveAndNavigate = async () => {
    await handleSaveBoard();
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowSaveConfirmation(false);
    setPendingNavigation(null);
  };

  const handleDiscardAndNavigate = () => {
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowSaveConfirmation(false);
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowSaveConfirmation(false);
    setPendingNavigation(null);
  };

  const handleAddTextElement = (type: 'heading' | 'paragraph') => {
    addTextElementLocally(type, { x: 200, y: 200 });
    toast({
      title: 'Success',
      description: `${type === 'heading' ? 'Heading' : 'Paragraph'} added to board`,
    });
  };

  const handleTextElementMove = (elementId: string, position: { x: number; y: number }, zIndex?: number) => {
    dispatch({
      type: 'UPDATE_TEXT_ELEMENT_POSITION',
      payload: { elementId, position, zIndex },
    });
  };

  const handleTextElementResize = (elementId: string, size: { width: number; height: number }) => {
    dispatch({
      type: 'UPDATE_TEXT_ELEMENT_SIZE',
      payload: { elementId, size },
    });
  };

  const handleTextElementUpdate = (elementId: string, updates: Partial<RaiBoardTextElement>) => {
    dispatch({
      type: 'UPDATE_TEXT_ELEMENT',
      payload: { elementId, updates },
    });
  };

  const handleTextElementRemove = (elementId: string) => {
    dispatch({ type: 'REMOVE_TEXT_ELEMENT', payload: elementId });
    toast({
      title: 'Success',
      description: 'Text element removed from board',
    });
  };

  const handleProductMove = (productId: string, position: { x: number; y: number }, zIndex?: number) => {
    dispatch({
      type: 'UPDATE_PRODUCT_POSITION',
      payload: { productId, position, zIndex },
    });
  };

  const handleProductResize = (productId: string, size: { width: number; height: number }) => {
    dispatch({
      type: 'UPDATE_PRODUCT_SIZE',
      payload: { productId, size },
    });
  };

  const handleProductRemove = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
    toast({
      title: 'Success',
      description: 'Product removed from board',
    });
  };

  const handleProductDoubleClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleInviteCollaborator = async (email: string, role: 'editor' | 'viewer') => {
    if (!state.board) return;
    
    try {
      await raiBoardService.inviteCollaborator(state.board.id, email, role);
      toast({
        title: 'Success',
        description: `Invitation sent to ${email}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    }
  };

  const handleAddProductToBoard = (product: Product) => {
    addProductLocally(product, { x: 100, y: 100 });
    setShowProductSearch(false);
    toast({
      title: 'Success',
      description: 'Product added to board',
    });
  };

  if (state.isLoading) {
    return <RaiBoardLoading />;
  }

  if (!state.board) {
    return <RaiBoardNotFound onNavigateBack={() => navigate('/raiboards')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <RaiBoardHeader
        boardName={state.board.name}
        boardDescription={state.board.description}
        isPublic={state.board.isPublic}
        hasUnsavedChanges={state.hasUnsavedChanges}
        saving={saving}
        userRole={userRole}
        onNavigateBack={() => handleNavigateWithConfirmation('/raiboards')}
        onSave={handleSaveBoard}
        onShare={() => setShowCollaborators(true)}
        collaboratorCount={state.board.collaborators.length}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        <RaiBoardToolbar
            onAddProduct={() => setShowProductSearch(true)}
            onAddHeading={() => handleAddTextElement('heading')}
            onAddParagraph={() => handleAddTextElement('paragraph')}
            onAddImage={() => toast({ title: 'Coming Soon', description: 'This feature is not yet implemented.'})}
            userRole={userRole}
            boardStats={{
                products: state.board.products.length,
                textElements: state.board.textElements.length
            }}
        />
        <div className="flex-1 relative bg-background">
          <RaiBoardCanvas
            board={state.board}
            onProductMove={handleProductMove}
            onProductResize={handleProductResize}
            onProductRemove={handleProductRemove}
            onProductDoubleClick={handleProductDoubleClick}
            onTextElementMove={handleTextElementMove}
            onTextElementResize={handleTextElementResize}
            onTextElementUpdate={handleTextElementUpdate}
            onTextElementRemove={handleTextElementRemove}
            userRole={userRole}
          />
          
          <CollaboratorPanel
            collaborators={state.board.collaborators}
            onInviteCollaborator={handleInviteCollaborator}
            userRole={userRole}
            isOpen={showCollaborators}
            onToggle={() => setShowCollaborators(!showCollaborators)}
          />
        </div>
      </div>

      <ProductSearchDialog
        isOpen={showProductSearch}
        onOpenChange={setShowProductSearch}
        onAddProduct={handleAddProductToBoard}
      />

      {/* Save Confirmation Dialog */}
      <SaveConfirmationDialog
        isOpen={showSaveConfirmation}
        onSave={handleSaveAndNavigate}
        onDiscard={handleDiscardAndNavigate}
        onCancel={handleCancelNavigation}
      />
    </div>
  );
};

const RaiBoardDetail: React.FC = () => {
  return (
    <RaiBoardProvider>
      <RaiBoardDetailContent />
    </RaiBoardProvider>
  );
};

export default RaiBoardDetail;
