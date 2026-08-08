import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL ?? "/api";
export async function getRoomsByHotel(hotelId) {
    const { data } = await axios.get(`${baseUrl}/hotels/${hotelId}/rooms`);
    return data;
}
export async function createRoom(hotelId, room, token) {
    const { data } = await axios.post(`${baseUrl}/hotels/${hotelId}/rooms`, room, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
}
export async function updateRoom(roomId, room, token) {
    const { data } = await axios.put(`${baseUrl}/rooms/${roomId}`, room, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
}
export async function deleteRoom(roomId, token) {
    await axios.delete(`${baseUrl}/rooms/${roomId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
}
export async function toggleRoomStatus(roomId, token) {
    const { data } = await axios.patch(`${baseUrl}/rooms/${roomId}/status`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
}
export async function getUpcomingBookings(hotelId) {
    const { data } = await axios.get(`${baseUrl}/hotels/${hotelId}/bookings`);
    return data;
}
