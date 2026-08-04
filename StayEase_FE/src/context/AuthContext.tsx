import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loginManager } from "../services/managerMockApi";
import type { ManagerUser } from "../types/manager";

type AuthContextValue = {
  user: ManagerUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const storageKey = "stayease-manager-session";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ManagerUser | null>(() => {
    try {
      return JSON.parse(
        window.localStorage.getItem(storageKey) ?? "null",
      ) as ManagerUser | null;
    } catch {
      return null;
    }
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (email, password) => {
        const manager = await loginManager(email, password);
        if (manager) {
          window.localStorage.setItem(storageKey, JSON.stringify(manager));
          setUser(manager);
          return true;
        }
        return false;
      },
      logout: () => {
        window.localStorage.removeItem(storageKey);
        setUser(null);
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
