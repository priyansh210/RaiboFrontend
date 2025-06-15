import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Home, Layout } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Room } from '@/models/internal/Room';
import { RaiBoard } from '@/models/internal/RaiBoard';
import { Product } from '@/models/internal/Product';
interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}
const AddProductDialog: React.FC<AddProductDialogProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [boards, setBoards] = useState<RaiBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isOpen) {
      fetchRoomsAndBoards();
    }
  }, [isOpen]);
  const fetchRoomsAndBoards = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockRooms: Room[] = [{
        id: '1',
        name: 'Living Room',
        description: 'Modern living space',
        room_type: 'living_room',
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        id: '2',
        name: 'Bedroom',
        description: 'Cozy bedroom setup',
        room_type: 'bedroom',
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];
      const mockBoards: RaiBoard[] = [{
        id: '1',
        name: 'Home Inspiration',
        description: 'Ideas for home decoration',
        ownerId: 'user1',
        ownerName: 'John Doe',
        products: [],
        textElements: [],
        collaborators: [],
        settings: {
          gridSize: 20,
          showGrid: true,
          allowOverlap: false,
          maxZoom: 3,
          minZoom: 0.5
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false
      }, {
        id: '2',
        name: 'Wishlist',
        description: 'Products I want to buy',
        ownerId: 'user1',
        ownerName: 'John Doe',
        products: [],
        textElements: [],
        collaborators: [],
        settings: {
          gridSize: 20,
          showGrid: true,
          allowOverlap: false,
          maxZoom: 3,
          minZoom: 0.5
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false
      }];
      setRooms(mockRooms);
      setBoards(mockBoards);
    } catch (error) {
      console.error('Failed to fetch rooms and boards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rooms and boards',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddToRoom = async (roomId: string, roomName: string) => {
    try {
      // TODO: Implement actual API call to add product to room
      console.log('Adding product to room:', {
        productId: product.id,
        roomId
      });
      toast({
        title: 'Added to Room',
        description: `${product.name} has been added to ${roomName}`
      });
      onClose();
    } catch (error) {
      console.error('Failed to add to room:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product to room',
        variant: 'destructive'
      });
    }
  };
  const handleAddToBoard = async (boardId: string, boardName: string) => {
    try {
      // TODO: Implement actual API call to add product to board
      console.log('Adding product to board:', {
        productId: product.id,
        boardId
      });
      toast({
        title: 'Added to Board',
        description: `${product.name} has been added to ${boardName}`
      });
      onClose();
    } catch (error) {
      console.error('Failed to add to board:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product to board',
        variant: 'destructive'
      });
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-[4px] px-0">
        <DialogHeader>
          <DialogTitle>Add "{product.name}" to...</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Home size={16} />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="boards" className="flex items-center gap-2">
              <Layout size={16} />
              Boards
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="mt-4">
            {isLoading ? <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div> : rooms.length > 0 ? <div className="space-y-2 max-h-60 overflow-y-auto">
                {rooms.map(room => <Button key={room.id} variant="outline" className="w-full justify-start h-auto p-3" onClick={() => handleAddToRoom(room.id, room.name)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Home size={20} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{room.name}</div>
                        <div className="text-sm text-muted-foreground">{room.description}</div>
                      </div>
                    </div>
                  </Button>)}
              </div> : <div className="text-center py-8 text-muted-foreground">
                <Home size={48} className="mx-auto mb-4 opacity-50" />
                <p>No rooms found</p>
                <p className="text-sm">Create a room to get started</p>
              </div>}
          </TabsContent>
          
          <TabsContent value="boards" className="mt-4">
            {isLoading ? <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div> : boards.length > 0 ? <div className="space-y-2 max-h-60 overflow-y-auto">
                {boards.map(board => <Button key={board.id} variant="outline" className="w-full justify-start h-auto p-3" onClick={() => handleAddToBoard(board.id, board.name)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Layout size={20} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{board.name}</div>
                        <div className="text-sm text-muted-foreground">{board.description}</div>
                      </div>
                    </div>
                  </Button>)}
              </div> : <div className="text-center py-8 text-muted-foreground">
                <Layout size={48} className="mx-auto mb-4 opacity-50" />
                <p>No boards found</p>
                <p className="text-sm">Create a board to get started</p>
              </div>}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>;
};
export default AddProductDialog;