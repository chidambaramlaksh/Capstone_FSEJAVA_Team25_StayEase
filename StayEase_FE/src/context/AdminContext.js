import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as adminApi from "../services/adminApi";
import { useAuth } from "./AuthContext";
const AdminContext = createContext(undefined);
export function AdminProvider({ children }) {
    const { user } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isAdmin = user?.role === "ADMIN";
    useEffect(() => {
        if (!isAdmin || !user?.token) {
            setHotels([]);
            return;
        }
        let isCurrentRequest = true;
        setIsLoading(true);
        setError(null);
        adminApi.getAdminHotels(user.token)
            .then((directory) => {
            if (isCurrentRequest) {
                setHotels(directory);
            }
        })
            .catch(() => {
            if (isCurrentRequest) {
                setHotels([]);
                setError("Unable to load the hotel directory. Please try again.");
            }
        })
            .finally(() => {
            if (isCurrentRequest)
                setIsLoading(false);
        });
        return () => {
            isCurrentRequest = false;
        };
    }, [isAdmin, user?.token]);
    const value = useMemo(() => ({
        hotels,
        isLoading,
        error,
        addHotel: async (hotel) => {
            if (!user?.token)
                throw new Error("Your admin session has expired.");
            const created = await adminApi.createHotel(hotel, user.token);
            setHotels((current) => [created, ...current]);
        },
        updateHotel: async (hotelId, hotel) => {
            if (!user?.token)
                throw new Error("Your admin session has expired.");
            const updated = await adminApi.updateHotel(hotelId, hotel, user.token);
            setHotels((current) => current.map((item) => item.id === hotelId ? updated : item));
        },
        deleteHotel: async (hotelId) => {
            if (!user?.token)
                throw new Error("Your admin session has expired.");
            await adminApi.deleteHotel(hotelId, user.token);
            setHotels((current) => current.filter((item) => item.id !== hotelId));
        },
    }), [error, isLoading, user?.token]);
    return _jsx(AdminContext.Provider, { value: value, children: children });
}
export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context)
        throw new Error("useAdmin must be used within AdminProvider");
    return context;
}
