import { Room } from '@/models/internal/Room';
import { apiService } from './ApiService';
import { ExternalRoomResponse } from '@/models/external/RoomModels';
import { mapExternalRoomsToRooms, mapExternalRoomToRoom } from '@/mappers/RoomMapper';

class RoomService {
  // Fetch all rooms for the current user
  async getUserRooms(): Promise<Room[]> {
    const response = await apiService.getUserRooms() as { rooms: ExternalRoomResponse[] } ;
    // If the API returns { rooms: Room[] }, extract it
    if (response && Array.isArray(response.rooms)) {
      return mapExternalRoomsToRooms(response.rooms);
    }
    // Fallback: empty array
    return [];
  }

  // Add product to a room
  async addProductToRoom(roomId: string, productId: string): Promise<void> {
    await apiService.addProductToRoom(roomId, productId);
  }

  // Remove product from a room
  async removeProductFromRoom(roomId: string, productId: string): Promise<void> {
    await apiService.removeProductFromRoom(roomId, productId);
  }

  // Create a new room
  async createRoom(roomData: { name: string; description?: string; room_type: string }): Promise<Room> {
    const response = await apiService.createRoom(roomData) as { data: Room };
    return response.data;
  }

  // Delete a room
  async deleteRoom(roomId: string): Promise<void> {
    await apiService.deleteRoom(roomId);
  }

  // Get a room by ID
  async getRoomById(roomId: string): Promise<Room> {
    const response = await apiService.getRoomById(roomId) as { data: ExternalRoomResponse } ;
    // If the API returns { rooms: Room[] }, extract it
    if (response.data) {
      return mapExternalRoomToRoom(response.data);
    }
  }
}

export const roomService = new RoomService();
