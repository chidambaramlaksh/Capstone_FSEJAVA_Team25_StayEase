import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL ?? "/api";
function authHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}
export async function getAdminHotels(token) {
    const { data } = await axios.get(`${baseUrl}/hotels/admin/directory`, {
        headers: authHeaders(token),
    });
    return data;
}
export async function createHotel(hotel, token) {
    const { data } = await axios.post(`${baseUrl}/hotels`, hotel, {
        headers: authHeaders(token),
    });
    return data;
}
export async function updateHotel(hotelId, hotel, token) {
    const { data } = await axios.put(`${baseUrl}/hotels/${hotelId}`, hotel, {
        headers: authHeaders(token),
    });
    return data;
}
export async function deleteHotel(hotelId, token) {
    await axios.delete(`${baseUrl}/hotels/${hotelId}`, {
        headers: authHeaders(token),
    });
}
