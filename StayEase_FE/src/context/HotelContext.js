import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
const storageKey = "stayease-hotels";
const HotelContext = createContext(undefined);
function readStoredHotels() {
    if (typeof window === "undefined")
        return [];
    try {
        return JSON.parse(window.sessionStorage.getItem(storageKey) ?? "[]");
    }
    catch {
        return [];
    }
}
export function HotelProvider({ children }) {
    const [hotels, setStoredHotels] = useState(readStoredHotels);
    useEffect(() => {
        window.sessionStorage.setItem(storageKey, JSON.stringify(hotels));
    }, [hotels]);
    const setHotels = useCallback((nextHotels) => {
        setStoredHotels(nextHotels);
    }, []);
    const getHotelById = useCallback((id) => hotels.find((hotel) => String(hotel.id) === String(id)) ?? null, [hotels]);
    const value = useMemo(() => ({ hotels, setHotels, getHotelById }), [hotels, setHotels, getHotelById]);
    return _jsx(HotelContext.Provider, { value: value, children: children });
}
export function useHotels() {
    const context = useContext(HotelContext);
    if (!context)
        throw new Error("useHotels must be used within HotelProvider");
    return context;
}
