import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginUser, logoutUser } from "../services/authApi";
import type { AuthUser } from "../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const storageKey = "stayease-auth-session";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(
      window.sessionStorage.getItem(storageKey) ?? "null",
    ) as AuthUser | null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email, password) => {
        const authenticatedUser = await loginUser(email, password);
        if (!authenticatedUser) return null;

        window.sessionStorage.setItem(
          storageKey,
          JSON.stringify(authenticatedUser),
        );
        setUser(authenticatedUser);
        return authenticatedUser;
      },
      logout: async () => {
        const token = user?.token;
        window.sessionStorage.removeItem(storageKey);
        window.localStorage.removeItem(storageKey);
        setUser(null);
        try {
          await logoutUser(token);
        } catch {
          // Local logout remains complete if the server cannot be reached.
        }
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
