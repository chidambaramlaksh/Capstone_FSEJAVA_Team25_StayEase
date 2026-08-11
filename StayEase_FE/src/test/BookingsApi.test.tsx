import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    getMyBookings,
    createBooking,
    cancelBooking,
} from "../services/bookingsApi";

vi.mock("axios");

const mockedGet = vi.mocked(axios.get);
const mockedPost = vi.mocked(axios.post);
const mockedPut = vi.mocked(axios.put);

describe("bookingsApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch current user's bookings", async () => {
        mockedGet.mockResolvedValue({
            data: [
                {
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
                },
            ],
        });

        const result = await getMyBookings(
            "jwt-token",
        );

        expect(mockedGet).toHaveBeenCalledWith(
            "/api/bookings/me",
            {
                headers: {
                    Authorization: "Bearer jwt-token",
                },
            },
        );

        expect(result).toHaveLength(1);
        expect(result[0].bookingRef).toBe(
            "SE-10001",
        );
    });

    it("should create a booking", async () => {
        mockedPost.mockResolvedValue({
            data: {
                id: 1,
                bookingRef: "SE-10001",
            },
        });

        await createBooking(
            "jwt-token",
            {
                roomId: 101,
                checkInDate: "2026-09-01",
                checkOutDate: "2026-09-03",
            },
        );

        expect(mockedPost).toHaveBeenCalledWith(
            "/api/bookings",
            {
                roomId: 101,
                checkInDate: "2026-09-01",
                checkOutDate: "2026-09-03",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer jwt-token",
                },
            },
        );
    });

    it("should cancel a booking", async () => {
        mockedPut.mockResolvedValue({
            data: {
                status: "CANCELLED",
            },
        });

        await cancelBooking(
            "jwt-token",
            100,
        );

        expect(mockedPut).toHaveBeenCalledWith(
            "/api/bookings/100/cancel",
            undefined,
            {
                headers: {
                    Authorization: "Bearer jwt-token",
                },
            },
        );
    });
});