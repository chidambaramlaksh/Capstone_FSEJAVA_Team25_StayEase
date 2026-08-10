import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
import * as managerApi from "../services/managerApi";
import { useAuth } from "./AuthContext";
const ManagerContext = createContext(undefined);
export function ManagerProvider({ children }) {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // Load rooms when user logs in as manager
    useEffect(() => {
        if (user && typeof user.managedHotelId === 'number') {
            loadRooms(user.managedHotelId);
        }
    }, [user?.managedHotelId]);
    const loadRooms = async (hotelId) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await managerApi.getRoomsByHotel(hotelId);
            setRooms(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load rooms");
            setRooms([]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const value = useMemo(() => ({
        rooms,
        isLoading,
        error,
        addRoom: async (hotelId, room) => {
            try {
                setError(null);
                const newRoom = await managerApi.createRoom(hotelId, room, user?.token);
                setRooms((current) => [newRoom, ...current]);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Failed to create room";
                setError(message);
                throw err;
            }
        },
        updateRoom: async (id, room) => {
            try {
                setError(null);
                const updated = await managerApi.updateRoom(id, room, user?.token);
                setRooms((current) => current.map((item) => (item.id === id ? updated : item)));
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Failed to update room";
                setError(message);
                throw err;
            }
        },
        deleteRoom: async (id) => {
            try {
                setError(null);
                await managerApi.deleteRoom(id, user?.token);
                setRooms((current) => current.filter((item) => item.id !== id));
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Failed to delete room";
                setError(message);
                throw err;
            }
        },
        toggleRoomStatus: async (id) => {
            try {
                setError(null);
                const updated = await managerApi.toggleRoomStatus(id, user?.token);
                setRooms((current) => current.map((item) => (item.id === id ? updated : item)));
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Failed to toggle room status";
                setError(message);
                throw err;
            }
        },
    }), [rooms, isLoading, error, user?.token]);
    return (_jsx(ManagerContext.Provider, { value: value, children: children }));
}
export function useManager() {
    const context = useContext(ManagerContext);
    if (!context)
        throw new Error("useManager must be used within ManagerProvider");
    return context;
}
