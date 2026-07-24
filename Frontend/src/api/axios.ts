/**
 * Axios client
 *
 * Single, shared Axios instance for the entire application.
 *
 * Interceptors:
 *  Request  — attaches JWT Bearer token from localStorage (via tokenStorage).
 *  Response — handles global HTTP error codes:
 *               401 → clears session + redirects to /login (skip auth endpoints)
 *               403 → shows a "Forbidden" notification (access denied)
 *               500 → shows a "Server Error" notification (unexpected errors)
 *
 * Rules:
 *  - Only this file is allowed to configure Axios interceptors.
 *  - No business logic here — only transport-level concerns.
 *  - UI notifications use antd's static notification API to avoid
 *    React rendering context constraints inside interceptors.
 */

import axios from "axios";
import { notification } from "antd";

import { getAccessToken, removeAccessToken, removeUserData } from "../utils/tokenStorage";

// ── Configure antd static notification (works outside React tree) ─────────────
notification.config({
    placement: "topRight",
    duration: 5,
});

// ── Auth endpoints that should NOT trigger a 401 redirect loop ────────────────
const AUTH_ENDPOINT_FRAGMENTS = [
    "/Identity/Account/Login",
    "/Identity/Account/Register",
    "/Identity/Account/ConfirmEmail",
    "/Identity/Account/ResendEmailConfirmation",
    "/Identity/Account/ForgetPassword",
    "/Identity/Account/VerifyOTP",
    "/Identity/Account/ResetPassword",
];

function isAuthEndpoint(url: string | undefined): boolean {
    if (!url) return false;
    return AUTH_ENDPOINT_FRAGMENTS.some((fragment) => url.includes(fragment));
}

// ── Public frontend paths that should NOT redirect to login on 401 ────────────
const PUBLIC_PATH_BASES = [
    "",
    "doctors",
    "about",
    "contact",
    "login",
    "register",
    "forgot-password",
    "verify-otp",
    "reset-password",
    "confirm-email",
    "resend-email-confirmation",
];

function isPublicPath(pathname: string): boolean {
    const base = pathname.split("/")[1] || "";
    return PUBLIC_PATH_BASES.includes(base.toLowerCase());
}

// ── Axios instance ─────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // 30-second timeout — prevents silent hangs on network issues
    timeout: 30_000,
});

// ── Request Interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// ── Response Interceptor ───────────────────────────────────────────────────────
api.interceptors.response.use(
    // ── Success path: pass through unchanged ────────────────────────────────
    (response) => response,

    // ── Error path: handle global HTTP error codes ───────────────────────────
    (error) => {
        if (!axios.isAxiosError(error)) {
            // Non-Axios error (e.g. programming bug) — let it bubble up
            return Promise.reject(error);
        }

        const status = error.response?.status;
        const requestUrl = error.config?.url;

        // ── 401 Unauthorized ──────────────────────────────────────────────────
        if (status === 401 && !isAuthEndpoint(requestUrl)) {
            // Wipe stale credentials
            removeAccessToken();
            removeUserData();

            // Only redirect if the user is currently on a protected page
            if (!isPublicPath(window.location.pathname)) {
                // Use replace so the protected page is not left in browser history
                window.location.replace("/login");
            }

            return Promise.reject(error);
        }

        // ── 403 Forbidden ─────────────────────────────────────────────────────
        if (status === 403) {
            notification.error({
                message: "Access Denied",
                description:
                    "You do not have permission to perform this action. " +
                    "Contact your administrator if you believe this is a mistake.",
                key: "forbidden-error",   // deduplicates concurrent 403s
            });

            return Promise.reject(error);
        }

        // ── 500 Internal Server Error (and other 5xx) ─────────────────────────
        if (status !== undefined && status >= 500) {
            // Extract a server-provided message if available, fall back to generic
            const serverMessage: string | undefined =
                (error.response?.data as { message?: string } | undefined)?.message;

            notification.error({
                message: "Server Error",
                description:
                    serverMessage ||
                    "An unexpected error occurred on the server. Please try again later.",
                key: "server-error",     // deduplicates concurrent 5xx errors
            });

            return Promise.reject(error);
        }

        // ── All other errors (400, 404, 409, etc.) ────────────────────────────
        // These are feature-specific — handled at the call site by each service.
        return Promise.reject(error);
    },
);

export default api;