import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getHotelsByCity } from "../services/hotelApi";

vi.mock("axios");

const mockedGet = vi.mocked(axios.get);

describe("hotelApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch hotels by city", async () => {
        mockedGet.mockResolvedValue({
            data: [
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
                            id: 101,
                            category: "Single",
                            description: "A serene room for one.",
                            price: 8500,
                            available: 4,
                            maxOccupancy: 3,
                        },
                    ],
                },
            ],
        } as any);

        const hotels = await getHotelsByCity("Mumbai");

        expect(mockedGet).toHaveBeenCalledWith(
            "/api/hotels",
            expect.objectContaining({
                params: {
                    city: "Mumbai",
                },
            }),
        );

        expect(hotels).toHaveLength(1);

        expect(hotels[0].name).toBe("The Marine House");
        expect(hotels[0].city).toBe("Mumbai");
        expect(hotels[0].rating).toBe(4.8);
        expect(hotels[0].price).toBe(8500);
    });

    it("should fetch hotels for Pune", async () => {
        mockedGet.mockResolvedValue({
            data: [
                {
                    id: 4,
                    name: "The Deccan Pavilion",
                    description:
                        "A graceful garden stay that pairs Pune warmth with modern comfort.",
                    city: "Pune",
                    image: "https://example.com/deccan-pavilion.jpg",
                    rating: 4.7,
                    price: 6200,
                    rooms: [],
                },
            ],
        } as any);

        const hotels = await getHotelsByCity("Pune");

        expect(mockedGet).toHaveBeenCalledWith(
            "/api/hotels",
            expect.objectContaining({
                params: {
                    city: "Pune",
                },
            }),
        );

        expect(hotels).toHaveLength(1);
        expect(hotels[0].name).toBe("The Deccan Pavilion");
        expect(hotels[0].city).toBe("Pune");
    });

    it("should return multiple hotels for a city", async () => {
        mockedGet.mockResolvedValue({
            data: [
                {
                    id: 1,
                    name: "The Marine House",
                    city: "Mumbai",
                    rating: 4.8,
                    price: 8500,
                    rooms: [],
                },
                {
                    id: 2,
                    name: "Kala Ghoda Courtyard",
                    city: "Mumbai",
                    rating: 4.6,
                    price: 7200,
                    rooms: [],
                },
                {
                    id: 3,
                    name: "Bandra Bay Suites",
                    city: "Mumbai",
                    rating: 4.7,
                    price: 9100,
                    rooms: [],
                },
            ],
        } as any);

        const hotels = await getHotelsByCity("Mumbai");

        expect(hotels).toHaveLength(3);

        expect(hotels[0].name).toBe("The Marine House");
        expect(hotels[1].name).toBe(
            "Kala Ghoda Courtyard",
        );
        expect(hotels[2].name).toBe("Bandra Bay Suites");
    });

    it("should return an empty array when no hotels are found", async () => {
        mockedGet.mockResolvedValue({
            data: [],
        } as any);

        const hotels = await getHotelsByCity("Chennai");

        expect(mockedGet).toHaveBeenCalledWith(
            "/api/hotels",
            expect.objectContaining({
                params: {
                    city: "Chennai",
                },
            }),
        );

        expect(hotels).toEqual([]);
    });

    it("should handle API response containing a hotels property", async () => {
        mockedGet.mockResolvedValue({
            data: {
                hotels: [
                    {
                        id: 1,
                        name: "The Marine House",
                        city: "Mumbai",
                        rating: 4.8,
                        price: 8500,
                        rooms: [],
                    },
                ],
            },
        } as any);

        const hotels = await getHotelsByCity("Mumbai");

        expect(hotels).toHaveLength(1);
        expect(hotels[0].name).toBe(
            "The Marine House",
        );
    });

    it("should handle API response containing a data property", async () => {
        mockedGet.mockResolvedValue({
            data: {
                data: [
                    {
                        id: 2,
                        name: "Kala Ghoda Courtyard",
                        city: "Mumbai",
                        rating: 4.6,
                        price: 7200,
                        rooms: [],
                    },
                ],
            },
        } as any);

        const hotels = await getHotelsByCity("Mumbai");

        expect(hotels).toHaveLength(1);
        expect(hotels[0].name).toBe(
            "Kala Ghoda Courtyard",
        );
    });

    it("should correctly return room information", async () => {
        mockedGet.mockResolvedValue({
            data: [
                {
                    id: 1,
                    name: "The Marine House",
                    city: "Mumbai",
                    rating: 4.8,
                    price: 8500,
                    rooms: [
                        {
                            id: 101,
                            category: "Single",
                            description:
                                "A serene room for one, with a queen bed and work desk.",
                            price: 8500,
                            available: 4,
                            maxOccupancy: 3,
                        },
                        {
                            id: 102,
                            category: "Double",
                            description:
                                "A spacious room with a king bed.",
                            price: 11200,
                            available: 6,
                            maxOccupancy: 3,
                        },
                    ],
                },
            ],
        } as any);

        const hotels = await getHotelsByCity("Mumbai");

        expect(hotels[0].rooms).toHaveLength(2);

        expect(hotels[0].rooms[0]).toEqual(
            expect.objectContaining({
                id: 101,
                category: "Single",
                price: 8500,
                available: 4,
                maxOccupancy: 3,
            }),
        );

        expect(hotels[0].rooms[1]).toEqual(
            expect.objectContaining({
                id: 102,
                category: "Double",
                price: 11200,
                available: 6,
                maxOccupancy: 3,
            }),
        );
    });

    it("should propagate API errors", async () => {
        mockedGet.mockRejectedValue(
            new Error("Network error"),
        );

        await expect(
            getHotelsByCity("Mumbai"),
        ).rejects.toThrow("Network error");
    });

    it("should propagate server errors", async () => {
        mockedGet.mockRejectedValue({
            response: {
                status: 500,
                data: {
                    message: "Internal Server Error",
                },
            },
        });

        await expect(
            getHotelsByCity("Mumbai"),
        ).rejects.toEqual({
            response: {
                status: 500,
                data: {
                    message: "Internal Server Error",
                },
            },
        });
    });

    it("should send the city as a query parameter", async () => {
        mockedGet.mockResolvedValue({
            data: [],
        } as any);

        await getHotelsByCity("Mumbai");

        expect(mockedGet).toHaveBeenCalledTimes(1);

        expect(mockedGet).toHaveBeenCalledWith(
            "/api/hotels",
            expect.objectContaining({
                params: {
                    city: "Mumbai",
                },
            }),
        );
    });

    it("should not make more than one API call", async () => {
        mockedGet.mockResolvedValue({
            data: [],
        } as any);

        await getHotelsByCity("Mumbai");

        expect(mockedGet).toHaveBeenCalledTimes(1);
    });
});