import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Room, RoomInput } from "../types/manager";

type ManagerContextValue = {
  rooms: Room[];
  addRoom: (hotelId: number, room: RoomInput) => void;
  updateRoom: (id: string, room: RoomInput) => void;
  deleteRoom: (id: string) => void;
};

const storageKey = "stayease-manager-rooms";
const starterRooms: Room[] = [
  {
    id: "r-101",
    hotelId: 1,
    roomNumber: "101",
    roomType: "Single",
    pricePerNight: 8500,
    maxOccupancy: 1,
    description: "A quiet sea-facing room with a work desk.",
    imageUrl:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=480&q=80",
    isActive: true,
  },
  {
    id: "r-202",
    hotelId: 1,
    roomNumber: "202",
    roomType: "Double",
    pricePerNight: 11200,
    maxOccupancy: 2,
    description: "A spacious king room with coastal accents.",
    imageUrl:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=480&q=80",
    isActive: true,
  },
  {
    id: "r-301",
    hotelId: 1,
    roomNumber: "301",
    roomType: "Suite",
    pricePerNight: 16900,
    maxOccupancy: 3,
    description: "A premium suite with a private lounge.",
    imageUrl:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=480&q=80",
    isActive: false,
  },
];
const ManagerContext = createContext<ManagerContextValue | undefined>(
  undefined,
);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      return (
        (JSON.parse(
          window.localStorage.getItem(storageKey) ?? "null",
        ) as Room[]) ?? starterRooms
      );
    } catch {
      return starterRooms;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(rooms));
  }, [rooms]);
  const value = useMemo(
    () => ({
      rooms,
      addRoom: (hotelId: number, room: RoomInput) =>
        setRooms((current) => [
          { ...room, hotelId, id: `room-${Date.now()}` },
          ...current,
        ]),
      updateRoom: (id: string, room: RoomInput) =>
        setRooms((current) =>
          current.map((item) => (item.id === id ? { ...item, ...room } : item)),
        ),
      deleteRoom: (id: string) =>
        setRooms((current) => current.filter((item) => item.id !== id)),
    }),
    [rooms],
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
