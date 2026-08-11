import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";

import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import { HotelProvider } from "../context/HotelContext";

describe("StayEase App", () => {
    it("should render the application without crashing", () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <HotelProvider>
                        <App />
                    </HotelProvider>
                </AuthProvider>
            </MemoryRouter>
        );

        expect(document.body).toBeTruthy();
    });
});