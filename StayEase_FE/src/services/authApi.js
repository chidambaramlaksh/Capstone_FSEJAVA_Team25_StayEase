import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
    "http://localhost:8080";
export const authTokenStorageKey = "stayease-auth-token";
const isRecord = (value) => typeof value === "object" && value !== null;
const stringValue = (...values) => values.find((value) => typeof value === "string" && value.length > 0);
const numberValue = (...values) => values.find((value) => typeof value === "number" && Number.isFinite(value));
export async function loginUser(email, password) {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password,
        });
        const root = isRecord(response.data) ? response.data : {};
        const payload = isRecord(root.data) ? root.data : root;
        const user = isRecord(payload.user) ? payload.user : payload;
        if (payload.success === false) {
            throw new Error(stringValue(payload.message, root.message) ?? "Invalid credentials.");
        }
        const userEmail = stringValue(user.email, payload.email, email.trim()) ?? email.trim();
        const role = stringValue(user.userType, user.role, payload.userType, payload.role, payload.type);
        return {
            name: stringValue(user.name, user.fullName, user.username, payload.name) ??
                userEmail.split("@")[0],
            email: userEmail,
            role: role?.toLowerCase() ?? "",
            hotelId: numberValue(user.hotelId, payload.hotelId),
            token: stringValue(payload.token, payload.accessToken, payload.jwt, root.token),
        };
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            const message = isRecord(data)
                ? stringValue(data.message, data.error)
                : undefined;
            throw new Error(message ?? "Unable to login. Please check your credentials.");
        }
        throw error;
    }
}
