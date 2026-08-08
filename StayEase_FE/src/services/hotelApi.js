import axios from "axios";
const hotelsApiUrl = import.meta.env.VITE_HOTELS_API_URL ?? "/api/hotels";
function asNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
}
function asString(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
}
function getHotelList(payload) {
    if (Array.isArray(payload))
        return payload;
    if (Array.isArray(payload.hotels))
        return payload.hotels;
    if (Array.isArray(payload.data))
        return payload.data;
    if (payload.data &&
        typeof payload.data === "object" &&
        Array.isArray(payload.data.hotels)) {
        return payload.data.hotels;
    }
    return [];
}
function mapHotel(hotel) {
    const id = hotel.id ?? hotel.hotelId ?? hotel.hotel_id;
    const name = hotel.name ?? hotel.hotelName ?? hotel.hotel_name;
    if (id === undefined || name === undefined)
        return null;
    const rooms = Array.isArray(hotel.rooms)
        ? hotel.rooms.map((room, index) => ({
            ...room,
            id: (room.id ?? room.roomId ?? room.room_id ?? index + 1),
            category: asString(room.category),
            description: asString(room.description),
            price: asNumber(room.price),
            available: asNumber(room.available),
            maxOccupancy: asNumber(room.maxOccupancy),
        }))
        : [];
    return {
        ...hotel,
        id: id,
        name: asString(name),
        description: asString(hotel.description ?? hotel.hotelDescription ?? hotel.overview),
        city: asString(hotel.city ?? hotel.location),
        image: asString(hotel.image ?? hotel.imageUrl ?? hotel.image_url ?? hotel.hotelImage),
        rating: asNumber(hotel.rating ?? hotel.starRating ?? hotel.averageRating),
        price: asNumber(hotel.price ?? hotel.pricePerNight ?? hotel.price_per_night),
        rooms,
    };
}
export async function getHotelsByCity(city) {
    const { data } = await axios.get(hotelsApiUrl, {
        params: { city },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return getHotelList(data).map(mapHotel).filter((hotel) => hotel !== null);
}
