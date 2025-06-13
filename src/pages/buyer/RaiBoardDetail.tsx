
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RaiBoard, RaiBoardTextElement } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
import { raiBoardService } from '@/services/RaiBoardService';
import { searchProducts } from '@/services/ProductService';
import { RaiBoardCanvas } from '@/components/raiboards/RaiBoardCanvas';
import { CollaboratorPanel } from '@/components/raiboards/CollaboratorPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Search, Settings, Share2, Save, Type, Heading } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RaiBoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [board, setBoard] = useState<RaiBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [userRole] = useState<'owner' | 'editor' | 'viewer'>('owner'); // Dummy user role

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;
    
    try {
      setLoading(true);
      const boardData = await raiBoardService.getBoardById(boardId);
      setBoard(boardData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load board',
        variant: 'destructive',
      });
      navigate('/raiboards');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBoard = async () => {
    if (!board) return;
    
    try {
      setSaving(true);
      await raiBoardService.saveBoard(board);
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

  const handleAddTextElement = async (type: 'heading' | 'paragraph') => {
    if (!board) return;
    
    try {
      const textElement = await raiBoardService.addTextElementToBoard(
        board.id,
        type,
        { x: 200, y: 200 }
      );
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          textElements: [...prev.textElements, textElement],
        };
      });
      
      toast({
        title: 'Success',
        description: `${type === 'heading' ? 'Heading' : 'Paragraph'} added to board`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add text element',
        variant: 'destructive',
      });
    }
  };

  const handleTextElementMove = async (elementId: string, position: { x: number; y: number }, zIndex?: number) => {
    if (!board) return;
    
    try {
      await raiBoardService.updateTextElement(board.id, elementId, { position, ...(zIndex !== undefined && { zIndex }) });
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          textElements: prev.textElements.map(el =>
            el.id === elementId
              ? { ...el, position, ...(zIndex !== undefined && { zIndex }) }
              : el
          ),
        };
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update text element position',
        variant: 'destructive',
      });
    }
  };

  const handleTextElementResize = async (elementId: string, size: { width: number; height: number }) => {
    if (!board) return;
    
    try {
      await raiBoardService.updateTextElement(board.id, elementId, { size });
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          textElements: prev.textElements.map(el =>
            el.id === elementId ? { ...el, size } : el
          ),
        };
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to resize text element',
        variant: 'destructive',
      });
    }
  };

  const handleTextElementUpdate = async (elementId: string, updates: Partial<RaiBoardTextElement>) => {
    if (!board) return;
    
    try {
      await raiBoardService.updateTextElement(board.id, elementId, updates);
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          textElements: prev.textElements.map(el =>
            el.id === elementId ? { ...el, ...updates } : el
          ),
        };
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update text element',
        variant: 'destructive',
      });
    }
  };

  const handleTextElementRemove = async (elementId: string) => {
    if (!board) return;
    
    try {
      await raiBoardService.removeTextElementFromBoard(board.id, elementId);
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          textElements: prev.textElements.filter(el => el.id !== elementId),
        };
      });
      
      toast({
        title: 'Success',
        description: 'Text element removed from board',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove text element',
        variant: 'destructive',
      });
    }
  };

  const handleProductMove = async (productId: string, position: { x: number; y: number }, zIndex?: number) => {
    if (!board) return;
    
    try {
      await raiBoardService.updateProductPosition(board.id, productId, position, zIndex);
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.map(p =>
            p.id === productId
              ? { ...p, position, ...(zIndex !== undefined && { zIndex }) }
              : p
          ),
        };
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product position',
        variant: 'destructive',
      });
    }
  };

  const handleProductRemove = async (productId: string) => {
    if (!board) return;
    
    try {
      await raiBoardService.removeProductFromBoard(board.id, productId);
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          products: prev.products.filter(p => p.id !== productId),
        };
      });
      
      toast({
        title: 'Success',
        description: 'Product removed from board',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove product',
        variant: 'destructive',
      });
    }
  };

  const handleProductDoubleClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleInviteCollaborator = async (email: string, role: 'editor' | 'viewer') => {
    if (!board) return;
    
    try {
      await raiBoardService.inviteCollaborator(board.id, email, role);
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

  const handleAddProductToBoard = async (product: Product) => {
    if (!board) return;
    
    try {
      const boardProduct = await raiBoardService.addProductToBoard(
        board.id,
        product,
        { x: 100, y: 100 }
      );
      
      // Update local state
      setBoard(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          products: [...prev.products, boardProduct],
        };
      });
      
      setShowProductSearch(false);
      setSearchTerm('');
      setSearchResults([]);
      
      toast({
        title: 'Success',
        description: 'Product added to board',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to board',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearchProducts(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!board) {
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
            onClick={() => navigate('/raiboards')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div>
            <h1 className="font-semibold text-lg">{board.name}</h1>
            {board.description && (
              <p className="text-sm text-gray-600">{board.description}</p>
            )}
          </div>
          
          {board.isPublic && (
            <Badge variant="secondary">Public</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddTextElement('heading')}
            disabled={userRole === 'viewer'}
          >
            <Heading className="w-4 h-4 mr-2" />
            Add Heading
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddTextElement('paragraph')}
            disabled={userRole === 'viewer'}
          >
            <Type className="w-4 h-4 mr-2" />
            Add Paragraph
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProductSearch(true)}
            disabled={userRole === 'viewer'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveBoard}
            disabled={saving || userRole === 'viewer'}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <RaiBoardCanvas
          board={board}
          onProductMove={handleProductMove}
          onProductRemove={handleProductRemove}
          onProductDoubleClick={handleProductDoubleClick}
          onTextElementMove={handleTextElementMove}
          onTextElementResize={handleTextElementResize}
          onTextElementUpdate={handleTextElementUpdate}
          onTextElementRemove={handleTextElementRemove}
          userRole={userRole}
        />
        
        {/* Collaborator Panel */}
        <CollaboratorPanel
          collaborators={board.collaborators}
          onInviteCollaborator={handleInviteCollaborator}
          userRole={userRole}
          isOpen={showCollaborators}
          onToggle={() => setShowCollaborators(!showCollaborators)}
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
    </div>
  );
};

export default RaiBoardDetail;
