export type UserRole = "MANAGER";

export type ManagerUser = {
  name: string;
  email: string;
  role: UserRole;
  hotelId: number;
};

export type Room = {
  id: string;
  hotelId: number;
  roomNumber: string;
  roomType: "Single" | "Double" | "Suite" | "Deluxe";
  pricePerNight: number;
  maxOccupancy: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

export type RoomInput = Omit<Room, "id" | "hotelId">;

export type ManagerBooking = {
  id: string;
  hotelId: number;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "Confirmed" | "Pending";
};
