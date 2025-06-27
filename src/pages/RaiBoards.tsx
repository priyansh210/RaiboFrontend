
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RaiBoard } from '@/models/internal/RaiBoard';
import { raiBoardService } from '@/services/RaiBoardService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Users, Calendar, Search, Grid3X3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const RaiBoards: React.FC = () => {
  const [boards, setBoards] = useState<RaiBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: '',
    description: '',
    isPublic: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      const userBoards = await raiBoardService.getUserBoards();
      console.log('Loaded boards:', userBoards);
      setBoards(userBoards);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your boards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    try {
      const board = await raiBoardService.createBoard(newBoard);
      setBoards([board, ...boards]);
      setIsCreateDialogOpen(false);
      setNewBoard({ name: '', description: '', isPublic: false });
      toast({
        title: 'Success',
        description: 'Board created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create board',
        variant: 'destructive',
      });
    }
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your boards...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Grid3X3 className="w-8 h-8 text-primary" />
              RaiBoards
            </h1>
            <p className="text-muted-foreground mt-2">
              Design and collaborate on your room layouts with drag-and-drop product boards
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Board</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Board Name</label>
                  <Input
                    placeholder="e.g., Living Room Design"
                    value={newBoard.name}
                    onChange={(e) => setNewBoard({...newBoard, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Describe your board's purpose..."
                    value={newBoard.description}
                    onChange={(e) => setNewBoard({...newBoard, description: e.target.value})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Public Board</label>
                  <Switch
                    checked={newBoard.isPublic}
                    onCheckedChange={(checked) => setNewBoard({...newBoard, isPublic: checked})}
                  />
                </div>
                <Button
                  onClick={handleCreateBoard}
                  disabled={!newBoard.name.trim()}
                  className="w-full"
                >
                  Create Board
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search your boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Boards Grid */}
        {filteredBoards.length === 0 ? (
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchTerm ? 'No boards found' : 'No boards yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first board to start designing your space'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Board
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board) => (
              <Link key={board.id} to={`/raiboards/${board.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{board.name}</span>
                      {board.isPublic && (
                        <Badge variant="secondary">Public</Badge>
                      )}
                    </CardTitle>
                    {board.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {board.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {board.collaborators.length} collaborators
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {board.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {board.products.length} products
                      </div>

                      {/* Product Preview Thumbnails */}
                      {board.products.length > 0 && (
                        <div className="flex gap-1 overflow-hidden">
                          {board.products.slice(0, 4).map((product) => (
                            <div key={product.id} className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                              <img
                                src={product.productImage}
                                alt={product.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {board.products.length > 4 && (
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                              +{board.products.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RaiBoards;
