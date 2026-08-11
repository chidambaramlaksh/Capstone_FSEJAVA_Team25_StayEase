import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Bookings from "../pages/Bookings";

const { mockGetMyBookings, mockCancelBooking } = vi.hoisted(() => ({
    mockGetMyBookings: vi.fn(),
    mockCancelBooking: vi.fn(),
}));

vi.mock("../services/bookingsApi", () => ({
    getMyBookings: mockGetMyBookings,
    cancelBooking: mockCancelBooking,
}));

let mockUser: {
    email: string;
    name: string;
    token?: string;
} | null = null;

vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
        login: vi.fn(),
        logout: vi.fn(),
    }),
}));

vi.mock("../services/bookingsApi", () => ({
    getMyBookings: mockGetMyBookings,
    cancelBooking: mockCancelBooking,
}));

const booking = {
    id: 1,
    bookingRef: "SE-10001",
    guestId: 10,
    roomId: 101,
    hotelId: 1,
    hotelName: "The Marine House",
    guestEmail: "ankita@gmail.com",
    checkInDate: "2026-09-01",
    checkOutDate: "2026-09-03",
    status: "CONFIRMED",
    totalPrice: 17000,
    createdAt: "2026-08-11T10:00:00Z",
};

function renderBookings() {
    return render(
        <MemoryRouter>
            <Bookings />
        </MemoryRouter>,
    );
}

describe("Bookings Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUser = {
            email: "ankita@gmail.com",
            name: "Ankita",
            token: "test-token",
        };

        mockGetMyBookings.mockResolvedValue([booking]);

        mockCancelBooking.mockResolvedValue({});
    });

    it("should show login message when user is not logged in", () => {
        mockUser = null;

        renderBookings();

        expect(
            screen.getByText(
                "Please log in to view your bookings.",
            ),
        ).toBeInTheDocument();
    });

    it("should load user bookings", async () => {
        renderBookings();

        await waitFor(() => {
            expect(mockGetMyBookings).toHaveBeenCalledWith(
                "test-token",
            );
        });

        expect(
            screen.getByText("The Marine House"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("SE-10001"),
        ).toBeInTheDocument();
    });

    it("should display booking details", async () => {
        renderBookings();

        await waitFor(() => {
            expect(
                screen.getByText("ankita@gmail.com"),
            ).toBeInTheDocument();

            expect(
                screen.getByText("101"),
            ).toBeInTheDocument();

            expect(
                screen.getByText("₹17,000"),
            ).toBeInTheDocument();
        });
    });

    it("should display no bookings message", async () => {
        mockGetMyBookings.mockResolvedValue([]);

        renderBookings();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "No bookings yet. Reserve a room to see it here.",
                ),
            ).toBeInTheDocument();
        });
    });

    it("should display error when bookings API fails", async () => {
        mockGetMyBookings.mockRejectedValue(
            new Error("Network error"),
        );

        renderBookings();

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Unable to load your bookings. Please try again.",
                ),
            ).toBeInTheDocument();
        });
    });

    it("should cancel a booking after confirmation", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);

        renderBookings();

        await waitFor(() => {
            expect(
                screen.getByText("The Marine House"),
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel booking/i,
            }),
        );

        await waitFor(() => {
            expect(mockCancelBooking).toHaveBeenCalledWith(
                "test-token",
                1,
            );
        });

        expect(
            screen.getByText("Booking cancelled"),
        ).toBeInTheDocument();

        vi.restoreAllMocks();
    });

    it("should not cancel booking when user rejects confirmation", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);

        renderBookings();

        await waitFor(() => {
            expect(
                screen.getByText("The Marine House"),
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel booking/i,
            }),
        );

        expect(
            mockCancelBooking,
        ).not.toHaveBeenCalled();

        vi.restoreAllMocks();
    });
});