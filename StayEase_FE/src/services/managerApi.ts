import axios from "axios";
import type { Room, RoomInput } from "../types/manager";

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

export async function getUpcomingBookings(hotelId: number): Promise<any[]> {
  const { data } = await axios.get(`${baseUrl}/hotels/${hotelId}/bookings`);
  return data;
}
