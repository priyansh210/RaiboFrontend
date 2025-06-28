import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { roomService } from '@/services/RoomService';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    room_type: 'living_room',
  });
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name.trim()) return;
    
    setCreating(true);
    try {
      const created = await roomService.createRoom(newRoom);
      toast({ 
        title: 'Room Created', 
        description: `Room "${created.name}" created successfully.` 
      });
      setNewRoom({ name: '', description: '', room_type: 'living_room' });
      onSuccess();
      onClose();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to create room', 
        variant: 'destructive' 
      });
    } finally {
      setCreating(false);
    }
  };

  const roomTypes = [
    { value: 'living_room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'dining_room', label: 'Dining Room' },
    { value: 'office', label: 'Office' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-w-[90vw] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Room</DialogTitle>
          <DialogDescription>
            Add a new room to organize your favorite products.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              placeholder="Enter room name"
              value={newRoom.name}
              onChange={e => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select 
              value={newRoom.room_type} 
              onValueChange={(value) => setNewRoom(prev => ({ ...prev, room_type: value }))}
            >
              <SelectTrigger id="roomType">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomDescription">Description (Optional)</Label>
            <Textarea
              id="roomDescription"
              placeholder="Enter a short description"
              value={newRoom.description}
              onChange={e => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
          
          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto order-1 sm:order-none">
              Cancel
            </Button>
            <Button type="submit" disabled={creating} className="w-full sm:w-auto">
              {creating ? 'Creating...' : 'Create Room'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
