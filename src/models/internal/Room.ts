
export interface Room {
  id: string;
  name: string;
  description: string;
  room_type: string;
  items: RoomItem[];
  created_at: string;
  updated_at: string;
}

export interface RoomItem {
  id: string;
  name: string;
  image: string;
  price?: number;
  description?: string;
}

export interface CreateRoomRequest {
  name: string;
  description?: string;
  room_type: string;
}

export const ROOM_TYPES = [
  { value: 'living_room', label: 'Living Room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'dining_room', label: 'Dining Room' },
  { value: 'office', label: 'Office' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'other', label: 'Other' },
] as const;
