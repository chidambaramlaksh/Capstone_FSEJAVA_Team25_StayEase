export type UserRole = "HOTEL_MANAGER";

export type ManagerUser = {
  name: string;
  email: string;
  role: UserRole;
  managedHotelId: number;
};

export type RoomType = "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE";

export type Room = {
  id: number;
  hotelId: number;
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  maxOccupancy: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  available: number;
};

export type RoomInput = {
  roomNumber: string;
  type: RoomType;
  pricePerNight: number;
  maxOccupancy?: number;
  description?: string;
  imageUrl?: string;
  active?: boolean;
  available?: number;
};

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
