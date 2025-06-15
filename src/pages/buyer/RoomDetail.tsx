
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Room } from '../../models/internal/Room';
import { apiService } from '../../services/ApiService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRoom(id);
    }
  }, [id]);

  const fetchRoom = async (roomId: string) => {
    try {
      setIsLoading(true);
      const roomData = await apiService.getRoomById(roomId);
      setRoom(roomData);
    } catch (error) {
      console.error('Failed to fetch room:', error);
      toast({
        title: 'Error',
        description: 'Failed to load room details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!room) return;
    
    try {
      await apiService.removeItemFromRoom(room.id, productId);
      setRoom(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.id !== productId)
      } : null);
      
      toast({
        title: 'Success',
        description: 'Item removed from room',
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
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
            <h2 className="text-xl text-foreground">Loading room...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-10">
          <div className="container mx-auto px-4">
            <Card className="text-center py-12">
              <CardContent>
                <h2 className="text-2xl font-bold text-foreground mb-4">Room Not Found</h2>
                <p className="text-muted-foreground mb-6">The room you're looking for doesn't exist.</p>
                <Link to="/my-rooms">
                   <Button>Back to My Rooms</Button>
                </Link>
              </CardContent>
            </Card>
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
          <div className="mb-8">
            <Link 
              to="/my-rooms" 
              className="text-muted-foreground hover:text-primary flex items-center text-sm mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to My Rooms
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{room.name}</h1>
                <p className="text-muted-foreground capitalize">{room.room_type.replace('_', ' ')}</p>
                {room.description && (
                  <p className="text-muted-foreground mt-2 max-w-prose">{room.description}</p>
                )}
              </div>
              
              <Link to="/browse/all">
                <Button>
                  <Plus size={20} className="mr-2" />
                  Add Items
                </Button>
              </Link>
            </div>
          </div>

          {/* Room Items */}
          {room.items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">No items in this room yet</h3>
                <p className="text-muted-foreground mb-6">Start adding products to visualize your room</p>
                <Link to="/browse/all">
                  <Button>
                    <Plus size={20} className="mr-2" />
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {room.items.map((item) => (
                <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground mb-1 line-clamp-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                    )}
                    {item.price && (
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    )}
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

export default RoomDetail;
