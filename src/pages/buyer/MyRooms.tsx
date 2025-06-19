import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Room, ROOM_TYPES, CreateRoomRequest } from '../../models/internal/Room';
import { apiService } from '../../services/ApiService';
import { toast } from '@/hooks/use-toast';
import { Plus, Home, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { roomService } from '@/services/RoomService';

const MyRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<CreateRoomRequest>({
    name: '',
    description: '',
    room_type: 'living_room',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const rooms = await roomService.getUserRooms();
      setRooms(rooms);
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

  const handleCreateRoom = async () => {
    if (!newRoom.name.trim()) {
      toast({
        title: 'Error',
        description: 'Room name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const createdRoom = await roomService.createRoom(newRoom);
      setRooms(prev => [...prev, createdRoom as Room]);
      setIsCreateModalOpen(false);
      setNewRoom({ name: '', description: '', room_type: 'living_room' });
      
      toast({
        title: 'Success',
        description: 'Room created successfully',
      });
    } catch (error) {
      console.error('Failed to create room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await roomService.deleteRoom(roomId);
      setRooms(prev => prev.filter(room => room.id !== roomId));
      
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl text-foreground">Loading rooms...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Rooms</h1>
              <p className="text-muted-foreground">Organize your favorite products by room</p>
            </div>
            
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={20} className="mr-2" />
                  Create Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input
                      id="room-name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Living Room"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="room-type">Room Type</Label>
                    <Select 
                      value={newRoom.room_type} 
                      onValueChange={(value) => setNewRoom(prev => ({ ...prev, room_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="room-description">Description (Optional)</Label>
                    <Textarea
                      id="room-description"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your room..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateRoom}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Create Room
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Rooms Grid */}
          {rooms.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Home size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">No rooms yet</h3>
                <p className="text-muted-foreground mb-6">Create your first room to start organizing your favorite products</p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus size={20} className="mr-2" />
                  Create Your First Room
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">{room.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">{room.room_type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    {room.description && (
                      <p className="text-sm text-muted-foreground mt-2">{room.description}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Room Items Preview */}
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          {room.items.length} items
                        </p>
                        {room.items.length > 0 ? (
                          <div className="flex -space-x-2">
                            {room.items.slice(0, 4).map((item, index) => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-full border-2 border-background object-cover"
                                style={{ zIndex: 10 - index }}
                              />
                            ))}
                            {room.items.length > 4 && (
                              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                                +{room.items.length - 4}
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No items added yet</p>
                        )}
                      </div>
                      
                      <Link 
                        to={`/room/${room.id}`}
                        className="block w-full"
                      >
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                          View Room
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyRooms;
