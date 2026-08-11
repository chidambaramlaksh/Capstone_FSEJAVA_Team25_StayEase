import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import HotelDetails from "../pages/HotelDetails";

const mockNavigate = vi.fn();
const mockAddBooking = vi.fn();
const { mockCreateBooking } = vi.hoisted(() => ({
    mockCreateBooking: vi.fn(),
}));

vi.mock("../services/bookingsApi", () => ({
    createBooking: mockCreateBooking,
}));

const hotel = {
    id: 1,
    name: "The Marine House",
    description:
        "A quiet coastal retreat with airy rooms and views of the Arabian Sea.",
    city: "Mumbai",
    image: "https://example.com/image.jpg",
    rating: 4.8,
    price: 8500,
    rooms: [
        {
            id: 101,
            category: "Single",
            description: "A serene room for one.",
            price: 8500,
            available: 4,
            maxOccupancy: 3,
        },
        {
            id: 102,
            category: "Double",
            description: "A spacious room for two.",
            price: 11200,
            available: 6,
            maxOccupancy: 3,
        },
        {
            id: 103,
            category: "Suite",
            description: "A premium suite.",
            price: 16900,
            available: 0,
            maxOccupancy: 3,
        },
    ],
};

let mockUser: {
    email: string;
    name: string;
    token?: string;
    role?: string;
} | null = {
    email: "ankita@gmail.com",
    name: "Ankita",
    token: "test-token",
    role: "USER",
};

vi.mock("../context/BookingContext", () => ({
    useBookings: () => ({
        bookings: [],
        addBooking: mockAddBooking,
        getBookingsForUser: vi.fn(),
    }),
}));

vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
        login: vi.fn(),
        logout: vi.fn(),
    }),
}));

vi.mock("../context/HotelContext", () => ({
    useHotels: () => ({
        hotels: [hotel],
        setHotels: vi.fn(),
        getHotelById: (id: string | number) =>
            String(id) === String(hotel.id) ? hotel : null,
    }),
}));

vi.mock("../services/bookingsApi", () => ({
    createBooking: mockCreateBooking,
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<
        typeof import("react-router-dom")
    >("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderHotelDetails(
    searchState = {
        activeSearch: {
            city: "Mumbai",
            checkIn: "2026-09-01",
            checkOut: "2026-09-03",
        },
    },
) {
    return render(
        <MemoryRouter
            initialEntries={[
                {
                    pathname: "/hotel/1",
                    state: searchState,
                },
            ]}
        >
            <Routes>
                <Route
                    path="/hotel/:hotelId"
                    element={<HotelDetails />}
                />
            </Routes>
        </MemoryRouter>,
    );
}

describe("HotelDetails", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUser = {
            email: "ankita@gmail.com",
            name: "Ankita",
            token: "test-token",
            role: "USER",
        };

        mockCreateBooking.mockResolvedValue({
            id: 100,
        });
    });

    it("should display hotel details", () => {
        renderHotelDetails();

        expect(
            screen.getByRole("heading", {
                name: "The Marine House",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("Mumbai · BOUTIQUE STAY", {
                exact: false,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText("★ 4.8 guest rating"),
        ).toBeInTheDocument();
    });

    it("should display all room categories", () => {
        renderHotelDetails();

        expect(
            screen.getByRole("heading", {
                name: "Single Room",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Double Room",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                name: "Suite Room",
            }),
        ).toBeInTheDocument();
    });

    it("should show Reserve room for available rooms", () => {
        renderHotelDetails();

        const buttons = screen.getAllByRole("button", {
            name: /reserve room/i,
        });

        expect(buttons.length).toBe(2);
    });

    it("should show Sold out for unavailable rooms", () => {
        renderHotelDetails();

        expect(
            screen.getByRole("button", {
                name: /sold out/i,
            }),
        ).toBeDisabled();
    });

    it("should create a booking when a room is reserved", async () => {
        renderHotelDetails();

        const reserveButtons = screen.getAllByRole("button", {
            name: /reserve room/i,
        });

        fireEvent.click(reserveButtons[0]);

        await waitFor(() => {
            expect(mockCreateBooking).toHaveBeenCalledWith(
                "test-token",
                {
                    roomId: 101,
                    checkInDate: "2026-09-01",
                    checkOutDate: "2026-09-03",
                },
            );
        });
    });

    it("should add booking to booking context after successful booking", async () => {
        renderHotelDetails();

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /reserve room/i,
            })[0],
        );

        await waitFor(() => {
            expect(mockAddBooking).toHaveBeenCalled();
        });
    });

    it("should navigate to booking confirmation", async () => {
        renderHotelDetails();

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /reserve room/i,
            })[0],
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
                "/booking-confirmation",
                expect.objectContaining({
                    state: expect.objectContaining({
                        hotel,
                    }),
                }),
            );
        });
    });

    it("should show login error when user is not authenticated", async () => {
        mockUser = null;

        renderHotelDetails();

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /reserve room/i,
            })[0],
        );

        expect(
            screen.getByText(
                "Please log in before reserving a room.",
            ),
        ).toBeInTheDocument();

        expect(
            mockCreateBooking,
        ).not.toHaveBeenCalled();
    });

    it("should show invalid date error when search dates are missing", () => {
        renderHotelDetails({
            activeSearch: {
                city: "Mumbai",
                checkIn: "",
                checkOut: "",
            },
        });

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /reserve room/i,
            })[0],
        );

        expect(
            screen.getByText(
                "Please select valid check-in and check-out dates.",
            ),
        ).toBeInTheDocument();
    });

    it("should display hotel not found for an invalid hotel id", () => {
        render(
            <MemoryRouter initialEntries={["/hotel/999"]}>
                <Routes>
                    <Route
                        path="/hotel/:hotelId"
                        element={<HotelDetails />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(
            screen.getByRole("heading", {
                name: "Hotel not found",
            }),
        ).toBeInTheDocument();
    });
});