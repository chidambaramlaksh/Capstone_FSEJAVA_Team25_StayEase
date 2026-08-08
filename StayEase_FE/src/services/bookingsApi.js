import axios from "axios";
const bookingsApiUrl = import.meta.env.VITE_BOOKINGS_API_URL ?? "/api/bookings/me";
const createBookingApiUrl = import.meta.env.VITE_CREATE_BOOKING_API_URL ?? "/api/bookings";
const cancelBookingApiUrl = import.meta.env.VITE_CANCEL_BOOKING_API_URL ?? "/api/bookings";
function getBookingList(payload) {
    if (Array.isArray(payload))
        return payload;
    if (Array.isArray(payload.bookings))
        return payload.bookings;
    if (Array.isArray(payload.data))
        return payload.data;
    return [];
}
export async function getMyBookings(token) {
    const { data } = await axios.get(bookingsApiUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return getBookingList(data);
}
export async function createBooking(token, booking) {
    const { data } = await axios.post(createBookingApiUrl, booking, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}
export async function cancelBooking(token, bookingId) {
    const { data } = await axios.put(`${cancelBookingApiUrl}/${encodeURIComponent(String(bookingId))}/cancel`, undefined, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return data;
}
