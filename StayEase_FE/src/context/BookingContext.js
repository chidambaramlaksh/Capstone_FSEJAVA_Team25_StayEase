import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
const STORAGE_KEY = "stayease-bookings";
const defaultValue = {
    bookings: [],
    addBooking: () => undefined,
    getBookingsForUser: () => [],
};
const BookingContext = createContext(defaultValue);
export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState(() => {
        if (typeof window === "undefined") {
            return [];
        }
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        try {
            return JSON.parse(stored);
        }
        catch {
            return [];
        }
    });
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
        }
    }, [bookings]);
    const addBooking = useCallback((booking) => {
        setBookings((current) => {
            if (current.some((item) => item.bookingId === booking.bookingId)) {
                return current;
            }
            return [booking, ...current];
        });
    }, []);
    const getBookingsForUser = useCallback((email) => {
        if (!email) {
            return [];
        }
        return bookings.filter((booking) => booking.userEmail?.toLowerCase() === email.toLowerCase());
    }, [bookings]);
    const value = useMemo(() => ({ bookings, addBooking, getBookingsForUser }), [bookings, addBooking, getBookingsForUser]);
    return _jsx(BookingContext.Provider, { value: value, children: children });
}
export function useBookings() {
    return useContext(BookingContext);
}
