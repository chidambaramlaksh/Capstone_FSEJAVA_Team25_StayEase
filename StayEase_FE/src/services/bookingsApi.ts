import axios from "axios";

export type UserBooking = {
  id: number | string;
  bookingRef: string;
  guestId: number | string;
  roomId: number | string;
  hotelId: number | string;
  hotelName: string;
  guestEmail: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  [key: string]: unknown;
};

type BookingsResponse = UserBooking[] | { data?: unknown; bookings?: unknown };

const bookingsApiUrl =
  import.meta.env.VITE_BOOKINGS_API_URL ?? "/api/bookings/me";
const createBookingApiUrl =
  import.meta.env.VITE_CREATE_BOOKING_API_URL ?? "/api/bookings";
const cancelBookingApiUrl =
  import.meta.env.VITE_CANCEL_BOOKING_API_URL ?? "/api/bookings";

export type CreateBookingRequest = {
  roomId: number | string;
  checkInDate: string;
  checkOutDate: string;
};

function getBookingList(payload: BookingsResponse): UserBooking[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.bookings)) return payload.bookings as UserBooking[];
  if (Array.isArray(payload.data)) return payload.data as UserBooking[];
  return [];
}

export async function getMyBookings(token: string): Promise<UserBooking[]> {
  const { data } = await axios.get<BookingsResponse>(bookingsApiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return getBookingList(data);
}

export async function createBooking(
  token: string,
  booking: CreateBookingRequest,
): Promise<unknown> {
  const { data } = await axios.post(createBookingApiUrl, booking, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function cancelBooking(
  token: string,
  bookingId: number | string,
): Promise<unknown> {
  const { data } = await axios.put(
    `${cancelBookingApiUrl}/${encodeURIComponent(String(bookingId))}/cancel`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}
