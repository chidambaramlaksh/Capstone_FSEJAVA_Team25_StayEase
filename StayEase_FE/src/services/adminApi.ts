import axios from "axios";
import type { AdminHotel, AdminHotelInput } from "../types/admin";

const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getAdminHotels(token: string): Promise<AdminHotel[]> {
  const { data } = await axios.get<AdminHotel[]>(`${baseUrl}/hotels/admin/directory`, {
    headers: authHeaders(token),
  });
  return data;
}

export async function createHotel(
  hotel: AdminHotelInput,
  token: string,
): Promise<AdminHotel> {
  const { data } = await axios.post<AdminHotel>(`${baseUrl}/hotels`, hotel, {
    headers: authHeaders(token),
  });
  return data;
}

export async function updateHotel(
  hotelId: number,
  hotel: AdminHotelInput,
  token: string,
): Promise<AdminHotel> {
  const { data } = await axios.put<AdminHotel>(`${baseUrl}/hotels/${hotelId}`, hotel, {
    headers: authHeaders(token),
  });
  return data;
}

export async function deleteHotel(hotelId: number, token: string): Promise<void> {
  await axios.delete(`${baseUrl}/hotels/${hotelId}`, {
    headers: authHeaders(token),
  });
}
