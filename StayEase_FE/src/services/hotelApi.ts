import axios from "axios";

export type HotelRoom = {
  id: number | string;
  category: string;
  description: string;
  price: number;
  available: number;
  maxOccupancy: number;
  [key: string]: unknown;
};

export type Hotel = {
  id: number | string;
  name: string;
  description: string;
  city: string;
  image: string;
  rating: number;
  price: number;
  rooms: HotelRoom[];
  [key: string]: unknown;
};

export type HotelSummary = Hotel;

type ApiHotel = Record<string, unknown>;
type HotelsResponse = ApiHotel[] | { data?: unknown; hotels?: unknown };

const hotelsApiUrl = import.meta.env.VITE_HOTELS_API_URL ?? "/api/hotels";

function asNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getHotelList(payload: HotelsResponse): ApiHotel[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.hotels)) return payload.hotels as ApiHotel[];
  if (Array.isArray(payload.data)) return payload.data as ApiHotel[];

  if (
    payload.data &&
    typeof payload.data === "object" &&
    Array.isArray((payload.data as { hotels?: unknown }).hotels)
  ) {
    return (payload.data as { hotels: ApiHotel[] }).hotels;
  }

  return [];
}

function mapHotel(hotel: ApiHotel): Hotel | null {
  const id = hotel.id ?? hotel.hotelId ?? hotel.hotel_id;
  const name = hotel.name ?? hotel.hotelName ?? hotel.hotel_name;

  if (id === undefined || name === undefined) return null;

  const rooms = Array.isArray(hotel.rooms)
    ? (hotel.rooms as ApiHotel[]).map((room, index) => ({
        ...room,
        id: (room.id ?? room.roomId ?? room.room_id ?? index + 1) as
          | number
          | string,
        category: asString(room.category),
        description: asString(room.description),
        price: asNumber(room.price),
        available: asNumber(room.available),
        maxOccupancy: asNumber(room.maxOccupancy),
      }))
    : [];

  return {
    ...hotel,
    id: id as number | string,
    name: asString(name),
    description: asString(
      hotel.description ?? hotel.hotelDescription ?? hotel.overview,
    ),
    city: asString(hotel.city ?? hotel.location),
    image: asString(
      hotel.image ?? hotel.imageUrl ?? hotel.image_url ?? hotel.hotelImage,
    ),
    rating: asNumber(
      hotel.rating ?? hotel.starRating ?? hotel.averageRating,
    ),
    price: asNumber(
      hotel.price ?? hotel.pricePerNight ?? hotel.price_per_night,
    ),
    rooms,
  };
}

export async function getHotelsByCity(city: string): Promise<HotelSummary[]> {
  const { data } = await axios.get<HotelsResponse>(hotelsApiUrl, {
    params: { city },
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return getHotelList(data).map(mapHotel).filter((hotel): hotel is HotelSummary => hotel !== null);
}
