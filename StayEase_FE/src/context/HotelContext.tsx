import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Hotel } from "../services/hotelApi";

type HotelContextValue = {
  hotels: Hotel[];
  setHotels: (hotels: Hotel[]) => void;
  getHotelById: (id: string | number) => Hotel | null;
};

const storageKey = "stayease-hotels";
const HotelContext = createContext<HotelContextValue | undefined>(undefined);

function readStoredHotels(): Hotel[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.sessionStorage.getItem(storageKey) ?? "[]") as Hotel[];
  } catch {
    return [];
  }
}

export function HotelProvider({ children }: { children: ReactNode }) {
  const [hotels, setStoredHotels] = useState<Hotel[]>(readStoredHotels);

  useEffect(() => {
    window.sessionStorage.setItem(storageKey, JSON.stringify(hotels));
  }, [hotels]);

  const setHotels = useCallback((nextHotels: Hotel[]) => {
    setStoredHotels(nextHotels);
  }, []);

  const getHotelById = useCallback(
    (id: string | number) =>
      hotels.find((hotel) => String(hotel.id) === String(id)) ?? null,
    [hotels],
  );

  const value = useMemo(
    () => ({ hotels, setHotels, getHotelById }),
    [hotels, setHotels, getHotelById],
  );

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotels() {
  const context = useContext(HotelContext);
  if (!context) throw new Error("useHotels must be used within HotelProvider");
  return context;
}

