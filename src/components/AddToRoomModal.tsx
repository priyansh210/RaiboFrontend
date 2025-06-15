
import React, { useState, useEffect } from 'react';
import { Room } from '../models/internal/Room';
import { apiService } from '../services/ApiService';
import { toast } from '@/hooks/use-toast';
import { Plus, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AddToRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

interface GetUserRoomsResponse {
  rooms: Room[];
}

const AddToRoomModal: React.FC<AddToRoomModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingToRoom, setAddingToRoom] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRooms();
    }
  }, [isOpen]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserRooms() as GetUserRoomsResponse;
      setRooms(response.rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rooms',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToRoom = async (roomId: string) => {
    try {
      setAddingToRoom(roomId);
      await apiService.addItemToRoom(roomId, productId);
      
      toast({
        title: 'Success',
        description: `${productName} added to room`,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to add item to room:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to room',
        variant: 'destructive',
      });
    } finally {
      setAddingToRoom(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Room</DialogTitle>
          <p className="text-sm text-earth">Choose a room to add "{productName}"</p>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-terracotta mx-auto"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-8">
              <Home size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-earth text-sm">No rooms found</p>
              <p className="text-xs text-gray-500 mt-1">Create a room first to add items</p>
            </div>
          ) : (
            rooms.map((room) => (
              <Card 
                key={room.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAddToRoom(room.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-charcoal">{room.name}</h3>
                      <p className="text-sm text-earth capitalize">
                        {room.room_type.replace('_', ' ')} • {room.items.length} items
                      </p>
                    </div>
                    <Button
                      size="sm"
                      disabled={addingToRoom === room.id}
                      className="bg-terracotta hover:bg-umber text-white"
                    >
                      {addingToRoom === room.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      ) : (
                        <Plus size={16} />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToRoomModal;
