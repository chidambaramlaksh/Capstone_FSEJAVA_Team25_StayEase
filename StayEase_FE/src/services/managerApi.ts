import axios from "axios";
import type { ManagerBooking, Room, RoomInput } from "../types/manager";

const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

export async function getRoomsByHotel(hotelId: number): Promise<Room[]> {
  const { data } = await axios.get<Room[]>(`${baseUrl}/hotels/${hotelId}/rooms`);
  return data;
}

export async function createRoom(hotelId: number, room: RoomInput, token?: string): Promise<Room> {
  const { data } = await axios.post<Room>(`${baseUrl}/hotels/${hotelId}/rooms`, room, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}

export async function updateRoom(roomId: number, room: RoomInput, token?: string): Promise<Room> {
  const { data } = await axios.put<Room>(`${baseUrl}/rooms/${roomId}`, room, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}

export async function deleteRoom(roomId: number, token?: string): Promise<void> {
  await axios.delete(`${baseUrl}/rooms/${roomId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function toggleRoomStatus(roomId: number, token?: string): Promise<Room> {
  const { data } = await axios.patch<Room>(`${baseUrl}/rooms/${roomId}/status`, {}, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}

type UpcomingBookingsResponse = ManagerBooking[] | { data?: unknown; bookings?: unknown };

function getBookingList(payload: UpcomingBookingsResponse): ManagerBooking[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.bookings)) return payload.bookings as ManagerBooking[];
  if (Array.isArray(payload.data)) return payload.data as ManagerBooking[];
  return [];
}

export async function getUpcomingBookings(token: string): Promise<ManagerBooking[]> {
  const { data } = await axios.get<UpcomingBookingsResponse>(
    `${baseUrl}/manager/bookings/upcoming`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return getBookingList(data);
}
