import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
import { raiBoardService } from '@/services/RaiBoardService';
import { searchProducts } from '@/services/ProductService';
import { RaiBoardCanvas } from '@/components/raiboards/RaiBoardCanvas';
import { RaiBoardToolbar } from '@/components/raiboards/RaiBoardToolbar';
import { CollaboratorPanel } from '@/components/raiboards/CollaboratorPanel';
import { SaveConfirmationDialog } from '@/components/raiboards/SaveConfirmationDialog';
import { RaiBoardProvider, useRaiBoard } from '@/context/RaiBoardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Settings, Save, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RaiBoardDetailContent: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { state, dispatch, addProductLocally, addTextElementLocally } = useRaiBoard();

  const [saving, setSaving] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
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

  const handleSearchProducts = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const results = await searchProducts(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search products:', error);
    }
  };

  const handleAddProductToBoard = (product: Product) => {
    addProductLocally(product, { x: 100, y: 100 });
    setShowProductSearch(false);
    setSearchTerm('');
    setSearchResults([]);
    toast({
      title: 'Success',
      description: 'Product added to board',
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchProducts(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (state.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!state.board) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Board not found</p>
          <Button onClick={() => navigate('/raiboards')} className="mt-4">
            Back to Boards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigateWithConfirmation('/raiboards')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">{state.board.name}</h1>
              {state.hasUnsavedChanges && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
              )}
            </div>
            {state.board.description && (
              <p className="text-sm text-gray-600">{state.board.description}</p>
            )}
          </div>
          
          {state.board.isPublic && (
            <Badge variant="secondary">Public</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={state.hasUnsavedChanges ? "default" : "outline"}
            size="sm"
            onClick={handleSaveBoard}
            disabled={saving || userRole === 'viewer'}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : state.hasUnsavedChanges ? 'Save*' : 'Save'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setShowCollaborators(true)}>
            <Users className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="flex-1 relative">
          <RaiBoardCanvas
            board={state.board}
            onProductMove={handleProductMove}
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
      </div>

      {/* Product Search Dialog */}
      <Dialog open={showProductSearch} onOpenChange={setShowProductSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Products to Board</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAddProductToBoard(product)}
                >
                  <img
                    src={product.displayImage || product.imageUrls[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                  </div>
                  <Button size="sm">Add</Button>
                </div>
              ))}
              
              {searchTerm && searchResults.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No products found for "{searchTerm}"
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
