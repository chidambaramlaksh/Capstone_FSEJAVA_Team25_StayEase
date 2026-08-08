import axios from "axios";
const loginApiUrl = import.meta.env.VITE_LOGIN_API_URL ?? "/api/auth/login";
const logoutApiUrl = import.meta.env.VITE_LOGOUT_API_URL ?? "/api/auth/logout";
export async function loginUser(email, password) {
    const { data } = await axios.post(loginApiUrl, {
        email: email.trim(),
        password,
    });
    if (!data?.token || !data?.email || !data?.name || data?.userId === undefined) {
        throw new Error("The login response is missing required user details.");
    }
    return data;
}
export async function logoutUser(token) {
    await axios.post(logoutApiUrl, undefined, token
        ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        : undefined);
}
