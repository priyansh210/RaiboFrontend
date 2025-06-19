import { ExternalRoomResponse } from '@/models/external/RoomModels';
import { Room, RoomItem } from '@/models/internal/Room';

// Map external API response to internal Room model
export function mapExternalRoomToRoom(external: ExternalRoomResponse): Room {
  return {
    id: external.id,
    name: external.name,
    description: external.description,
    room_type: external.room_type,
    items: (external.items || []).map(mapExternalRoomProductToRoomItem) as RoomItem[],
    created_at: '', // Not present in external, set as empty or handle elsewhere
    updated_at: '', // Not present in external, set as empty or handle elsewhere
  };
}

// Helper: Map external product to RoomItem (refine as needed)
function mapExternalRoomProductToRoomItem(product: any): RoomItem {
  return {
    id: product.id || '',
    name: product.name || '',
    image: product.image|| '',
    price: product.price,
    description: product.description,
  };
}

// Map array
export function mapExternalRoomsToRooms(externals: ExternalRoomResponse[]): Room[] {
  return externals.map(mapExternalRoomToRoom);
}
