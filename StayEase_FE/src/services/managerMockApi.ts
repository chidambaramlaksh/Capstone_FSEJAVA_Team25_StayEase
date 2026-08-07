import { loginUser } from "./authApi";
import type { ManagerBooking, ManagerUser } from "../types/manager";

const delay = (milliseconds = 250) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function loginManager(
  email: string,
  password: string,
): Promise<ManagerUser | null> {
  const user = await loginUser(email, password);

  if (user.role !== "manager") {
    return null;
  }

  return {
    name: user.name,
    email: user.email,
    role: "MANAGER",
    hotelId: user.hotelId ?? 1,
  };
}

export async function getUpcomingBookings(
  hotelId: number,
): Promise<ManagerBooking[]> {
  await delay();
  return mockBookings.filter((booking) => booking.hotelId === hotelId);
}

const mockBookings: ManagerBooking[] = [
  {
    id: "SE-240601",
    hotelId: 1,
    guestName: "Aarav Mehta",
    guestEmail: "aarav@example.com",
    roomNumber: "101",
    roomType: "Single",
    checkIn: "2026-08-12",
    checkOut: "2026-08-15",
    guests: 1,
    status: "Confirmed",
  },
  {
    id: "SE-240602",
    hotelId: 1,
    guestName: "Nisha Shah",
    guestEmail: "nisha@example.com",
    roomNumber: "202",
    roomType: "Double",
    checkIn: "2026-08-14",
    checkOut: "2026-08-17",
    guests: 2,
    status: "Confirmed",
  },
  {
    id: "SE-240603",
    hotelId: 1,
    guestName: "Kabir Rao",
    guestEmail: "kabir@example.com",
    roomNumber: "301",
    roomType: "Suite",
    checkIn: "2026-08-18",
    checkOut: "2026-08-20",
    guests: 2,
    status: "Pending",
  },
  {
    id: "SE-240604",
    hotelId: 1,
    guestName: "Meera Iyer",
    guestEmail: "meera@example.com",
    roomNumber: "203",
    roomType: "Double",
    checkIn: "2026-08-21",
    checkOut: "2026-08-24",
    guests: 3,
    status: "Confirmed",
  },
];
