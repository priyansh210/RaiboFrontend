import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RaiBoard, RaiBoardInvite } from '@/models/internal/RaiBoard';
import { raiBoardService } from '@/services/RaiBoardService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Users, Calendar, Search, Grid3X3, X, Check, EyeOff, Eye } from 'lucide-react';
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
  const [invitations, setInvitations] = useState<RaiBoardInvite[]>([]);
  const [showInvites, setShowInvites] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBoards();
    loadInvitations();
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

  const loadInvitations = async () => {
    try {
      const invites = await raiBoardService.getAllBoardInvite();
      setInvitations(
        invites
          .filter(inv => inv.status === 'pending')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load invitations',
        variant: 'destructive',
      });
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

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await raiBoardService.acceptBoardInvite(inviteId);
      setInvitations(prev => prev.filter(inv => inv.id !== inviteId));
      toast({ title: 'Invitation Accepted', description: 'You have joined the board.' });
      loadBoards();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to accept invitation', variant: 'destructive' });
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await raiBoardService.declineBoardInvite(inviteId);
      setInvitations(prev => prev.filter(inv => inv.id !== inviteId));
      toast({ title: 'Invitation Declined', description: 'You have declined the invitation.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to decline invitation', variant: 'destructive' });
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

        {/* Invitations Section */}
        {showInvites && invitations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Board Invitations
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowInvites(false)} title="Hide invitations">
                <EyeOff className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              {invitations.map((invite) => (
                <Card key={invite.id} className="border-primary/30 w-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{invite.boardName}</span>
                      <Badge variant="secondary">{invite.role.charAt(0).toUpperCase() + invite.role.slice(1)}</Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Invited by <span className="font-medium">{invite.inviterName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {invite.numberOfProducts} products • Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleAcceptInvite(invite.id)}>
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDeclineInvite(invite.id)}>
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {!showInvites && invitations.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" size="sm" onClick={() => setShowInvites(true)}>
              <Eye className="w-4 h-4 mr-1" /> Show Invitations ({invitations.length})
            </Button>
          </div>
        )}

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
