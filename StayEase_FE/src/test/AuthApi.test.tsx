import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    loginUser,
    logoutUser,
} from "../services/authApi";

vi.mock("axios");

const mockedPost = vi.mocked(axios.post);

describe("authApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should login with email and password", async () => {
        mockedPost.mockResolvedValue({
            data: {
                userId: 1,
                email: "ankita@gmail.com",
                name: "Ankita",
                token: "jwt-token",
                role: "USER",
            },
        });

        const result = await loginUser(
            "ankita@gmail.com",
            "123456",
        );

        expect(mockedPost).toHaveBeenCalledWith(
            "/api/auth/login",
            {
                email: "ankita@gmail.com",
                password: "123456",
            },
        );

        expect(result).toEqual({
            userId: 1,
            email: "ankita@gmail.com",
            name: "Ankita",
            token: "jwt-token",
            role: "USER",
        });
    });

    it("should trim email before login", async () => {
        mockedPost.mockResolvedValue({
            data: {
                userId: 1,
                email: "ankita@gmail.com",
                name: "Ankita",
                token: "jwt-token",
                role: "USER",
            },
        });

        await loginUser(
            "  ankita@gmail.com  ",
            "123456",
        );

        expect(mockedPost).toHaveBeenCalledWith(
            "/api/auth/login",
            {
                email: "ankita@gmail.com",
                password: "123456",
            },
        );
    });

    it("should reject incomplete login response", async () => {
        mockedPost.mockResolvedValue({
            data: {
                email: "ankita@gmail.com",
            },
        });

        await expect(
            loginUser("ankita@gmail.com", "123456"),
        ).rejects.toThrow(
            "The login response is missing required user details.",
        );
    });

    it("should call logout API with bearer token", async () => {
        mockedPost.mockResolvedValue({
            data: {},
        });

        await logoutUser("jwt-token");

        expect(mockedPost).toHaveBeenCalledWith(
            "/api/auth/logout",
            undefined,
            {
                headers: {
                    Authorization: "Bearer jwt-token",
                },
            },
        );
    });
});