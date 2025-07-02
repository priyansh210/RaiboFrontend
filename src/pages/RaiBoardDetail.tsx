import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/models/internal/Product';
import { RaiBoardCanvas } from '@/components/raiboards/RaiBoardCanvas';
import { RaiBoardToolbar } from '@/components/raiboards/RaiBoardToolbar';
import { CollaboratorPanel } from '@/components/raiboards/CollaboratorPanel';
import { SaveConfirmationDialog } from '@/components/raiboards/SaveConfirmationDialog';
import { TempCartDialog } from '@/components/raiboards/TempCartDialog';
import { BundleCartButton } from '@/components/raiboards/BundleCartButton';
import { RaiBoardProvider } from '@/context/RaiBoardContext';
import { TempCartProvider } from '@/context/TempCartContext';
import { useToast } from '@/hooks/use-toast';
import { RaiBoardHeader } from '@/components/raiboards/RaiBoardHeader';
import { ProductSearchDialog } from '@/components/raiboards/ProductSearchDialog';
import { RaiBoardLoading } from '@/components/raiboards/RaiBoardLoading';
import { RaiBoardNotFound } from '@/components/raiboards/RaiBoardNotFound';
import { useBoardData } from '@/hooks/useBoardData';
import { useBoardNavigation } from '@/hooks/useBoardNavigation';
import { useBoardInteractions } from '@/hooks/useBoardInteractions';
import SimilarProductsDialog from '@/components/raiboards/SimilarProductsDialog';

const RaiBoardDetailContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { board, isLoading, hasUnsavedChanges, isSaving, saveBoard, user } = useBoardData();
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
    handleInviteCollaborator,
    handleChangeCollaboratorRole
  } = useBoardInteractions();

  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showSimilarDialog, setShowSimilarDialog] = useState(false);
  const [similarProductId, setSimilarProductId] = useState<string | null>(null);
  // Determine user role for this board
  let userRole: 'owner' | 'editor' | 'viewer' = 'viewer';
  if (board && user) {
    if (board.collaborators.some(c => c.id === user.id && c.role === 'owner')) {
      userRole = 'owner';
    } else if (board.collaborators.some(c => c.id === user.id && c.role === 'editor')) {
      userRole = 'editor';
    } else if (board.collaborators.some(c => c.id === user.id && c.role === 'viewer')) {
      userRole = 'viewer';
    }
  }
  
  const canEdit = userRole === 'owner' || userRole === 'editor';

  const handleProductDoubleClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const onAddProduct = (product: Product) => {
      handleAddProductToBoard(product);
      setShowProductSearch(false);
  };

  // Handler for opening similar products dialog from ProductCard
  const handleOpenSimilarProducts = (productId: string) => {
    setSimilarProductId(productId);
    setShowSimilarDialog(true);
  };

  // Handler for adding a similar product
  const handleAddSimilarProduct = (product: Product) => {
    handleAddProductToBoard(product);
    setShowSimilarDialog(false);
  };

  if (isLoading) {
    return <RaiBoardLoading />;
  }

  if (!board) {
    return <RaiBoardNotFound onNavigateBack={() => navigate('/raiboards')} />;
  }  return (
    <div className="h-screen flex flex-col bg-background text-foreground dark:bg-gray-900 dark:text-white">
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

      {/* Show user role info */}
      {/* <div className="max-w-2xl mx-auto mt-2 mb-2 text-center">
        <span className="inline-block rounded bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          Your role on this board: <span className="font-bold text-primary">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
        </span>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Only show toolbar if owner or editor */}
        {(userRole === 'owner' || userRole === 'editor') && (
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
        )}
        <div className="flex-1 relative bg-background">
          <RaiBoardCanvas
            board={board}
            onProductMove={canEdit ? handleProductMove : () => {}}
            onProductResize={canEdit ? handleProductResize : () => {}}
            onProductRemove={canEdit ? handleProductRemove : () => {}}
            onProductDoubleClick={handleProductDoubleClick}
            onTextElementMove={canEdit ? handleTextElementMove : () => {}}
            onTextElementResize={canEdit ? handleTextElementResize : () => {}}
            onTextElementUpdate={canEdit ? handleTextElementUpdate : () => {}}
            onTextElementRemove={canEdit ? handleTextElementRemove : () => {}}
            userRole={userRole}
            onOpenSimilarProducts={handleOpenSimilarProducts}
          />
          <CollaboratorPanel
            collaborators={board.collaborators}
            onInviteCollaborator={handleInviteCollaborator}
            userRole={userRole}
            isOpen={showCollaborators}
            onOpenChange={setShowCollaborators}
            onChangeRole={userRole === 'owner' ? handleChangeCollaboratorRole : undefined}
            currentUserId={user?.id}
          />

          {/* Bundle Cart Button */}
          <BundleCartButton />
        </div>
      </div>

      <ProductSearchDialog
        isOpen={showProductSearch}
        onOpenChange={setShowProductSearch}
        onAddProduct={onAddProduct}
      />

      {/* Temp Cart Dialog */}
      <TempCartDialog />

      {/* Save Confirmation Dialog */}
      <SaveConfirmationDialog
        isOpen={showSaveConfirmation}
        onSave={handleSaveAndNavigate}
        onDiscard={handleDiscardAndNavigate}
        onCancel={handleCancelNavigation}
      />

      <SimilarProductsDialog
        isOpen={showSimilarDialog}
        onOpenChange={setShowSimilarDialog}
        parentProductId={similarProductId}
        onAddProduct={handleAddSimilarProduct}
      />
    </div>
  );
};

const RaiBoardDetail: React.FC = () => {
  return (
    <TempCartProvider>
      <RaiBoardProvider>
        <RaiBoardDetailContent />
      </RaiBoardProvider>
    </TempCartProvider>
  );
};

export default RaiBoardDetail;
