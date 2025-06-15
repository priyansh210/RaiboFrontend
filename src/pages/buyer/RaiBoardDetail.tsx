import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/models/internal/Product';
import { RaiBoardCanvas } from '@/components/raiboards/RaiBoardCanvas';
import { RaiBoardToolbar } from '@/components/raiboards/RaiBoardToolbar';
import { CollaboratorPanel } from '@/components/raiboards/CollaboratorPanel';
import { SaveConfirmationDialog } from '@/components/raiboards/SaveConfirmationDialog';
import { RaiBoardProvider } from '@/context/RaiBoardContext';
import { useToast } from '@/hooks/use-toast';
import { RaiBoardHeader } from '@/components/raiboards/RaiBoardHeader';
import { ProductSearchDialog } from '@/components/raiboards/ProductSearchDialog';
import { RaiBoardLoading } from '@/components/raiboards/RaiBoardLoading';
import { RaiBoardNotFound } from '@/components/raiboards/RaiBoardNotFound';
import { useBoardData } from '@/hooks/useBoardData';
import { useBoardNavigation } from '@/hooks/useBoardNavigation';
import { useBoardInteractions } from '@/hooks/useBoardInteractions';

const RaiBoardDetailContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { board, isLoading, hasUnsavedChanges, isSaving, saveBoard } = useBoardData();
  const { 
    showSaveConfirmation,
    navigateWithConfirmation,
    handleSaveAndNavigate,
    handleDiscardAndNavigate,
    handleCancelNavigation
  } = useBoardNavigation(saveBoard);
  const {
    handleAddTextElement,
    handleTextElementMove,
    handleTextElementResize,
    handleTextElementUpdate,
    handleTextElementRemove,
    handleAddProductToBoard,
    handleProductMove,
    handleProductResize,
    handleProductRemove,
    handleInviteCollaborator
  } = useBoardInteractions();

  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [userRole] = useState<'owner' | 'editor' | 'viewer'>('owner');

  const handleProductDoubleClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const onAddProduct = (product: Product) => {
      handleAddProductToBoard(product);
      setShowProductSearch(false);
  };

  if (isLoading) {
    return <RaiBoardLoading />;
  }

  if (!board) {
    return <RaiBoardNotFound onNavigateBack={() => navigate('/raiboards')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <RaiBoardHeader
        boardName={board.name}
        boardDescription={board.description}
        isPublic={board.isPublic}
        hasUnsavedChanges={hasUnsavedChanges}
        saving={isSaving}
        userRole={userRole}
        onNavigateBack={() => navigateWithConfirmation('/raiboards')}
        onSave={saveBoard}
        onShare={() => setShowCollaborators(true)}
        collaboratorCount={board.collaborators.length}
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
                products: board.products.length,
                textElements: board.textElements.length
            }}
        />
        <div className="flex-1 relative bg-background">
          <RaiBoardCanvas
            board={board}
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
            collaborators={board.collaborators}
            onInviteCollaborator={handleInviteCollaborator}
            userRole={userRole}
            isOpen={showCollaborators}
            onOpenChange={setShowCollaborators}
          />
        </div>
      </div>

      <ProductSearchDialog
        isOpen={showProductSearch}
        onOpenChange={setShowProductSearch}
        onAddProduct={onAddProduct}
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
