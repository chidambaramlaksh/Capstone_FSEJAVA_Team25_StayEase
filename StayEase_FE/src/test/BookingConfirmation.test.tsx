import { render, screen } from "@testing-library/react";
import {
    MemoryRouter,
    Route,
    Routes,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import BookingConfirmation from "../pages/BookingConfirmation";

const mockAddBooking = vi.fn();

vi.mock("../context/BookingContext", () => ({
    useBookings: () => ({
        bookings: [],
        addBooking: mockAddBooking,
        getBookingsForUser: vi.fn(),
    }),
}));

const bookingState = {
    bookingId: "SE-12345678-1S",

    hotel: {
        name: "The Marine House",
        city: "Mumbai",
        image: "https://example.com/image.jpg",
    },

    room: {
        category: "Single",
        price: 8500,
        maxOccupancy: 3,
    },

    search: {
        checkIn: "2026-09-01",
        checkOut: "2026-09-03",
    },

    bookingEntry: {
        bookingId: "SE-12345678-1S",
        hotelName: "The Marine House",
        hotelCity: "Mumbai",
        hotelImage: "https://example.com/image.jpg",
        roomCategory: "Single",
        roomPrice: 8500,
        maxOccupancy: 3,
        checkIn: "2026-09-01",
        checkOut: "2026-09-03",
        totalPrice: 17000,
        bookedOn: "2026-08-11T10:00:00Z",
    },
};

function renderConfirmation() {
    return render(
        <MemoryRouter
            initialEntries={[
                {
                    pathname: "/booking-confirmation",
                    state: bookingState,
                },
            ]}
        >
            <Routes>
                <Route
                    path="/booking-confirmation"
                    element={<BookingConfirmation />}
                />
            </Routes>
        </MemoryRouter>,
    );
}

describe("BookingConfirmation", () => {
    it("should display booking confirmation", () => {
        renderConfirmation();

        expect(
            screen.getByText("BOOKING CONFIRMED"),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Your stay is reserved.",
            }),
        ).toBeInTheDocument();
    });

    it("should display booking id", () => {
        renderConfirmation();

        expect(
            screen.getByText("SE-12345678-1S"),
        ).toBeInTheDocument();
    });

    it("should display hotel name", () => {
        renderConfirmation();

        expect(
            screen.getByRole("heading", {
                name: "The Marine House",
            }),
        ).toBeInTheDocument();
    });

    it("should display room category", () => {
        renderConfirmation();

        expect(
            screen.getByText("Single Room"),
        ).toBeInTheDocument();
    });

    it("should calculate the total price correctly", () => {
        renderConfirmation();

        expect(
            screen.getByText("₹17,000"),
        ).toBeInTheDocument();
    });

    it("should add booking to booking context", () => {
        renderConfirmation();

        expect(mockAddBooking).toHaveBeenCalledWith(
            bookingState.bookingEntry,
        );
    });

    it("should show fallback when no booking state is supplied", () => {
        render(
            <MemoryRouter
                initialEntries={["/booking-confirmation"]}
            >
                <Routes>
                    <Route
                        path="/booking-confirmation"
                        element={<BookingConfirmation />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(
            screen.getByRole("heading", {
                name: "No booking selected",
            }),
        ).toBeInTheDocument();
    });
});