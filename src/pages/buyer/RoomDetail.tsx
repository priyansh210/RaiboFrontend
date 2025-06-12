
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Room } from '../../models/internal/Room';
import { apiService } from '../../services/ApiService';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
            <h2 className="text-xl text-charcoal">Loading room...</h2>
          </div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <div className="bg-white p-8 text-center rounded-lg">
              <h2 className="text-2xl text-charcoal mb-4">Room Not Found</h2>
              <p className="text-earth mb-6">The room you're looking for doesn't exist.</p>
              <Link 
                to="/my-rooms" 
                className="bg-terracotta text-white py-2 px-6 inline-block hover:bg-umber transition-colors rounded-lg"
              >
                Back to My Rooms
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-6 md:py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/my-rooms" 
              className="text-earth hover:text-terracotta flex items-center text-sm mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to My Rooms
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-charcoal mb-2">{room.name}</h1>
                <p className="text-earth capitalize">{room.room_type.replace('_', ' ')}</p>
                {room.description && (
                  <p className="text-earth mt-2">{room.description}</p>
                )}
              </div>
              
              <Link to="/browse">
                <Button className="bg-terracotta hover:bg-umber text-white">
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
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-charcoal mb-2">No items in this room yet</h3>
                <p className="text-earth mb-6">Start adding products to visualize your room</p>
                <Link to="/browse">
                  <Button className="bg-terracotta hover:bg-umber text-white">
                    <Plus size={20} className="mr-2" />
                    Browse Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {room.items.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-charcoal mb-1 line-clamp-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-earth mb-2 line-clamp-2">{item.description}</p>
                    )}
                    {item.price && (
                      <p className="text-lg font-bold text-terracotta">${item.price}</p>
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
