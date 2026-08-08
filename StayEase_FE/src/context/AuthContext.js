import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState, } from "react";
import { loginUser, logoutUser } from "../services/authApi";
const storageKey = "stayease-auth-session";
const AuthContext = createContext(undefined);
function readStoredUser() {
    if (typeof window === "undefined")
        return null;
    try {
        return JSON.parse(window.sessionStorage.getItem(storageKey) ?? "null");
    }
    catch {
        return null;
    }
}
export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);
    const value = useMemo(() => ({
        user,
        login: async (email, password) => {
            const authenticatedUser = await loginUser(email, password);
            if (!authenticatedUser)
                return null;
            window.sessionStorage.setItem(storageKey, JSON.stringify(authenticatedUser));
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
            }
            catch {
                // Local logout remains complete if the server cannot be reached.
            }
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
