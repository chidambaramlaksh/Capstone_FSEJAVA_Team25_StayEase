import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as adminApi from "../services/adminApi";
import { useAuth } from "./AuthContext";
import type { AdminHotel, AdminHotelInput } from "../types/admin";

type AdminContextValue = {
  hotels: AdminHotel[];
  isLoading: boolean;
  error: string | null;
  addHotel: (hotel: AdminHotelInput) => Promise<void>;
  updateHotel: (hotelId: number, hotel: AdminHotelInput) => Promise<void>;
  deleteHotel: (hotelId: number) => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<AdminHotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [isAdmin, user?.token]);

  const value = useMemo<AdminContextValue>(() => ({
    hotels,
    isLoading,
    error,
    addHotel: async (hotel) => {
      if (!user?.token) throw new Error("Your admin session has expired.");
      const created = await adminApi.createHotel(hotel, user.token);
      setHotels((current) => [created, ...current]);
    },
    updateHotel: async (hotelId, hotel) => {
      if (!user?.token) throw new Error("Your admin session has expired.");
      const updated = await adminApi.updateHotel(hotelId, hotel, user.token);
      setHotels((current) => current.map((item) => item.id === hotelId ? updated : item));
    },
    deleteHotel: async (hotelId) => {
      if (!user?.token) throw new Error("Your admin session has expired.");
      await adminApi.deleteHotel(hotelId, user.token);
      setHotels((current) => current.filter((item) => item.id !== hotelId));
    },
  }), [error, hotels, isLoading, user?.token]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within AdminProvider");
  return context;
}
