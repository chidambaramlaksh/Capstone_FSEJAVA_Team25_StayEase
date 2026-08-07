export type AuthUser = {
  userId: number | string;
  token: string;
  email: string;
  name: string;
  role?: string;
  userType?: string;
  hotelId?: number;
  [key: string]: unknown;
};

