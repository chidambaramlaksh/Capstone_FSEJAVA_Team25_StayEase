export type AuthUser = {
  userId: number | string;
  token: string;
  email: string;
  name: string;
  role?: string;
  userType?: string;
  managedHotelId?: number;
  [key: string]: unknown;
};
