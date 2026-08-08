import axios from "axios";
import type { AuthUser } from "../types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

const loginApiUrl =
  import.meta.env.VITE_LOGIN_API_URL ?? "/api/auth/login";
const logoutApiUrl =
  import.meta.env.VITE_LOGOUT_API_URL ?? "/api/auth/logout";

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const { data } = await axios.post<AuthUser>(loginApiUrl, {
    email: email.trim(),
    password,
  } satisfies LoginPayload);

  if (!data?.token || !data?.email || !data?.name || data?.userId === undefined) {
    throw new Error("The login response is missing required user details.");
  }

  return data;
}

export async function logoutUser(token?: string): Promise<void> {
  await axios.post(logoutApiUrl, undefined, token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : undefined);
}
