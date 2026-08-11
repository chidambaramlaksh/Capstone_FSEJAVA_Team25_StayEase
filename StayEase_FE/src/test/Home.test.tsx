import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "../pages/Home";

const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockSetHotels = vi.fn();

let mockUser: {
    email: string;
    name: string;
    role?: string;
    token?: string;
} | null = null;

const mockHotels = [
    {
        id: 1,
        name: "The Marine House",
        description:
            "A quiet coastal retreat with airy rooms and views of the Arabian Sea.",
        city: "Mumbai",
        image: "https://example.com/marine-house.jpg",
        rating: 4.8,
        price: 8500,
        rooms: [
            {
                id: 1,
                category: "Single",
                description: "A serene room for one.",
                price: 8500,
                available: 4,
                maxOccupancy: 3,
            },
        ],
    },
    {
        id: 2,
        name: "Kala Ghoda Courtyard",
        description: "A heritage-inspired stay in Mumbai.",
        city: "Mumbai",
        image: "https://example.com/kala-ghoda.jpg",
        rating: 4.6,
        price: 7200,
        rooms: [
            {
                id: 2,
                category: "Double",
                description: "A spacious double room.",
                price: 9800,
                available: 4,
                maxOccupancy: 3,
            },
        ],
    },
];


vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
        login: mockLogin,
        logout: mockLogout,
    }),
}));

vi.mock("../context/HotelContext", () => ({
    useHotels: () => ({
        hotels: mockHotels,
        setHotels: mockSetHotels,
        getHotelById: vi.fn(),
    }),
}));

const { mockGetHotelsByCity } = vi.hoisted(() => ({
    mockGetHotelsByCity: vi.fn(),
}));

vi.mock("../services/hotelApi", () => ({
    getHotelsByCity: mockGetHotelsByCity,
}));

function renderHome() {
    return render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>,
    );
}

describe("Home Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUser = null;

        mockGetHotelsByCity.mockResolvedValue(mockHotels);

        localStorage.clear();
        sessionStorage.clear();
    });

    it("should render the StayEase home page", () => {
        renderHome();

        expect(screen.getByText("StayEase")).toBeInTheDocument();

        expect(
            screen.getByText("Comfort, wherever", { exact: false }),
        ).toBeInTheDocument();
    });

    it("should display the search modal when the page loads", () => {
        renderHome();

        expect(
            screen.getByRole("dialog", {
                name: /where are you going/i,
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("City")).toBeInTheDocument();
        expect(screen.getByText("Check-in")).toBeInTheDocument();
        expect(screen.getByText("Check-out")).toBeInTheDocument();
    });

    it("should display Mumbai and Pune as city options", () => {
        renderHome();

        const citySelect = screen.getByRole("combobox");

        expect(citySelect).toBeInTheDocument();

        expect(
            screen.getByRole("option", { name: "Mumbai" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("option", { name: "Pune" }),
        ).toBeInTheDocument();
    });

    it("should disable Search hotels initially", () => {
        renderHome();

        const searchButton = screen.getByRole("button", {
            name: /search hotels/i,
        });

        expect(searchButton).toBeDisabled();
    });

    it("should enable Search hotels when valid search details are entered", () => {
        renderHome();

        const citySelect = screen.getByRole("combobox");

        const dateInputs = screen.getAllByDisplayValue("");

        fireEvent.change(citySelect, {
            target: {
                value: "Mumbai",
            },
        });

        const dateInputsAfterCity = screen.getAllByDisplayValue("");

        fireEvent.change(dateInputsAfterCity[0], {
            target: {
                value: "2026-09-01",
            },
        });

        fireEvent.change(dateInputsAfterCity[1], {
            target: {
                value: "2026-09-03",
            },
        });

        const searchButton = screen.getByRole("button", {
            name: /search hotels/i,
        });

        expect(searchButton).toBeEnabled();
    });

    it("should show validation when check-out is before check-in", () => {
        renderHome();

        const citySelect = screen.getByRole("combobox");

        fireEvent.change(citySelect, {
            target: {
                value: "Mumbai",
            },
        });

        const dateInputs = screen.getAllByDisplayValue("");

        fireEvent.change(dateInputs[0], {
            target: {
                value: "2026-09-10",
            },
        });

        fireEvent.change(dateInputs[1], {
            target: {
                value: "2026-09-05",
            },
        });

        expect(
            screen.getByText("Check-out must be after check-in."),
        ).toBeInTheDocument();
    });

    it("should search hotels for Mumbai", async () => {
        renderHome();

        const citySelect = screen.getByRole("combobox");

        fireEvent.change(citySelect, {
            target: {
                value: "Mumbai",
            },
        });

        const dateInputs = screen.getAllByDisplayValue("");

        fireEvent.change(dateInputs[0], {
            target: {
                value: "2026-09-01",
            },
        });

        fireEvent.change(dateInputs[1], {
            target: {
                value: "2026-09-03",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /search hotels/i,
            }),
        );

        await waitFor(() => {
            expect(mockGetHotelsByCity).toHaveBeenCalledWith("Mumbai");
        });
    });

    it("should display hotels after successful search", async () => {
        renderHome();

        const citySelect = screen.getByRole("combobox");

        fireEvent.change(citySelect, {
            target: {
                value: "Mumbai",
            },
        });

        const dateInputs = screen.getAllByDisplayValue("");

        fireEvent.change(dateInputs[0], {
            target: {
                value: "2026-09-01",
            },
        });

        fireEvent.change(dateInputs[1], {
            target: {
                value: "2026-09-03",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /search hotels/i,
            }),
        );

        await waitFor(() => {
            expect(
                screen.getByText("The Marine House"),
            ).toBeInTheDocument();

            expect(
                screen.getByText("Kala Ghoda Courtyard"),
            ).toBeInTheDocument();
        });
    });

    it("should display hotel rating and price", async () => {
        renderHome();

        const citySelect = screen.getByRole("combobox");

        fireEvent.change(citySelect, {
            target: {
                value: "Mumbai",
            },
        });

        const dateInputs = screen.getAllByDisplayValue("");

        fireEvent.change(dateInputs[0], {
            target: {
                value: "2026-09-01",
            },
        });

        fireEvent.change(dateInputs[1], {
            target: {
                value: "2026-09-03",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /search hotels/i,
            }),
        );

        await waitFor(() => {
            expect(screen.getByText("★ 4.8")).toBeInTheDocument();
            expect(screen.getByText(/₹8,500/)).toBeInTheDocument();
        });
    });

    it("should display an error when hotel API fails", async () => {
        mockGetHotelsByCity.mockRejectedValue(
            new Error("API failure"),
        );

        renderHome();

        fireEvent.change(screen.getByRole("combobox"), {
            target: {
                value: "Mumbai",
            },
        });

        const dateInputs = screen.getAllByDisplayValue("");

        fireEvent.change(dateInputs[0], {
            target: {
                value: "2026-09-01",
            },
        });

        fireEvent.change(dateInputs[1], {
            target: {
                value: "2026-09-03",
            },
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /search hotels/i,
            }),
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    "Unable to load hotels for this city.",
                ),
            ).toBeInTheDocument();
        });
    });

    it("should open login modal when Login is clicked", () => {
        renderHome();

        fireEvent.click(
            screen.getByRole("button", {
                name: /^login$/i,
            }),
        );

        expect(
            screen.getByRole("dialog", {
                name: /login to stayease/i,
            }),
        ).toBeInTheDocument();
    });

    it("should show login validation for invalid credentials", async () => {
        renderHome();

        fireEvent.click(
            screen.getByRole("button", {
                name: /^login$/i,
            }),
        );

        const emailInput = screen.getByPlaceholderText(
            "you@example.com",
        );

        const passwordInput = screen.getByPlaceholderText(
            "At least 6 characters",
        );

        fireEvent.change(emailInput, {
            target: {
                value: "invalid-email",
            },
        });

        fireEvent.change(passwordInput, {
            target: {
                value: "123",
            },
        });

        const loginDialog = screen.getByRole("dialog", {
            name: /login to stayease/i,
        });

        const loginButton = within(loginDialog).getByRole("button", {
            name: /^login$/i,
        });

        expect(loginButton).toBeDisabled();
    });

    it("should successfully login a normal user", async () => {
        mockLogin.mockResolvedValue({
            userId: 1,
            email: "ankita@gmail.com",
            name: "Ankita",
            token: "test-token",
            role: "USER",
        });

        renderHome();

        fireEvent.click(
            screen.getByRole("button", {
                name: /^login$/i,
            }),
        );

        fireEvent.change(
            screen.getByPlaceholderText("you@example.com"),
            {
                target: {
                    value: "ankita@gmail.com",
                },
            },
        );

        fireEvent.change(
            screen.getByPlaceholderText("At least 6 characters"),
            {
                target: {
                    value: "123456",
                },
            },
        );

        const loginDialog = screen.getByRole("dialog", {
            name: /login to stayease/i,
        });

        fireEvent.click(
            within(loginDialog).getByRole("button", {
                name: /^login$/i,
            }),
        );

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                "ankita@gmail.com",
                "123456",
            );
        });
    });
});