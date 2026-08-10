import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as managerApi from "../services/managerApi";
import { useAuth } from "./AuthContext";
import type { Room, RoomInput } from "../types/manager";

type ManagerContextValue = {
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
  addRoom: (hotelId: number, room: RoomInput) => Promise<void>;
  updateRoom: (id: number, room: RoomInput) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  toggleRoomStatus: (id: number) => Promise<void>;
};

const ManagerContext = createContext<ManagerContextValue | undefined>(
  undefined,
);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load rooms when user logs in as manager
  useEffect(() => {
    if (user && typeof user.managedHotelId === 'number') {
      loadRooms(user.managedHotelId);
    }
  }, [user?.managedHotelId]);

  const loadRooms = async (hotelId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await managerApi.getRoomsByHotel(hotelId);
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rooms");
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      rooms,
      isLoading,
      error,
      addRoom: async (hotelId: number, room: RoomInput) => {
        try {
          setError(null);
          const newRoom = await managerApi.createRoom(hotelId, room, user?.token);
          setRooms((current) => [newRoom, ...current]);
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to create room";
          setError(message);
          throw err;
        }
      },
      updateRoom: async (id: number, room: RoomInput) => {
        try {
          setError(null);
          const updated = await managerApi.updateRoom(id, room, user?.token);
          setRooms((current) =>
            current.map((item) => (item.id === id ? updated : item)),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to update room";
          setError(message);
          throw err;
        }
      },
      deleteRoom: async (id: number) => {
        try {
          setError(null);
          await managerApi.deleteRoom(id, user?.token);
          setRooms((current) => current.filter((item) => item.id !== id));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to delete room";
          setError(message);
          throw err;
        }
      },
      toggleRoomStatus: async (id: number) => {
        try {
          setError(null);
          const updated = await managerApi.toggleRoomStatus(id, user?.token);
          setRooms((current) =>
            current.map((item) => (item.id === id ? updated : item)),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Failed to toggle room status";
          setError(message);
          throw err;
        }
      },
    }),
    [rooms, isLoading, error, user?.token],
  );

  return (
    <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>
  );
}

export function useManager() {
  const context = useContext(ManagerContext);
  if (!context)
    throw new Error("useManager must be used within ManagerProvider");
  return context;
}
