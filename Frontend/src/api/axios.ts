import axios from "axios";
import { getAccessToken, removeAccessToken, removeUserData } from "../utils/tokenStorage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            axios.isAxiosError(error) &&
            error.response?.status === 401 &&
            !error.config?.url?.includes("/Identity/Account/Login")
        ) {
            removeAccessToken();
            removeUserData();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;