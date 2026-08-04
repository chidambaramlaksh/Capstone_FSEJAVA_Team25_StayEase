import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BookingEntry = {
  bookingId: string;
  hotelName: string;
  hotelCity: string;
  hotelImage: string;
  roomCategory: string;
  roomPrice: number;
  maxOccupancy: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  bookedOn: string;
  userEmail?: string;
};

type BookingContextValue = {
  bookings: BookingEntry[];
  addBooking: (booking: BookingEntry) => void;
  getBookingsForUser: (email: string | null | undefined) => BookingEntry[];
};

const STORAGE_KEY = "stayease-bookings";
const defaultValue: BookingContextValue = {
  bookings: [],
  addBooking: () => undefined,
  getBookingsForUser: () => [],
};
const BookingContext = createContext<BookingContextValue>(defaultValue);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingEntry[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as BookingEntry[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    }
  }, [bookings]);

  const addBooking = useCallback((booking: BookingEntry) => {
    setBookings((current) => {
      if (current.some((item) => item.bookingId === booking.bookingId)) {
        return current;
      }

      return [booking, ...current];
    });
  }, []);

  const getBookingsForUser = useCallback((email: string | null | undefined) => {
    if (!email) {
      return [];
    }

    return bookings.filter((booking) => booking.userEmail?.toLowerCase() === email.toLowerCase());
  }, [bookings]);

  const value = useMemo(() => ({ bookings, addBooking, getBookingsForUser }), [bookings, addBooking, getBookingsForUser]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  return useContext(BookingContext);
}
