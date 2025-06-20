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
  const [showSimilarDialog, setShowSimilarDialog] = useState(false);
  const [similarProductId, setSimilarProductId] = useState<string | null>(null);
  const [userRole] = useState<'owner' | 'editor' | 'viewer'>('owner');

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
        <div className="flex-1 relative bg-background">          {/* Mobile Instructions Hint - only on smaller screens */}
          {/* <div className="md:hidden absolute top-2 left-14 right-2 z-20 bg-card/70 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-foreground dark:text-white dark:bg-card/80 shadow-sm">
            <p>• Pinch to zoom • Drag with one finger • Tap elements to edit</p>
          </div>
           */}
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
            onOpenSimilarProducts={handleOpenSimilarProducts}
          />
          
          <CollaboratorPanel
            collaborators={board.collaborators}
            onInviteCollaborator={handleInviteCollaborator}
            userRole={userRole}
            isOpen={showCollaborators}
            onOpenChange={setShowCollaborators}
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
