import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState, } from "react";
import { loginManager } from "../services/managerMockApi";
const storageKey = "stayease-manager-session";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
        }
        catch {
            return null;
        }
    });
    const value = useMemo(() => ({
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
    }), [user]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context;
}
