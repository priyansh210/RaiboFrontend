// External Room API response model
export interface ExternalRoomResponse {
  id: string;
  name: string;
  description: string;
  room_type: string;
  items: any[]; // Can be refined if product structure is known
  __v: number;
}
