import { createContext } from "react";

import type { AuthenticatedResponse } from "../types/authenticatedResponse";

/**
 * The shape of a resolved user session.
 *
 * Derived from AuthenticatedResponse and the decoded JWT payload.
 * Does NOT store the raw AccessToken — that is managed exclusively
 * by tokenStorage and never exposed to UI consumers.
 */
export interface AuthUser {
    /** Server-assigned user ID (UUID), extracted from the JWT `sub` claim. */
    userId: string | null;
    userName: string;
    email: string;
    fullName: string;
    /** One of: "Admin" | "Doctor" | "Patient" | "Receptionist" */
    role: string;
}

/**
 * The full contract of AuthContext.
 *
 * Rules:
 *  - No HTTP types (AxiosResponse, ApiResponse, etc.)
 *  - No endpoint strings
 *  - No localStorage calls
 *  - State + state-mutating actions only
 */
export interface AuthContextValue {
    /** The currently authenticated user. Null when not logged in. */
    currentUser: AuthUser | null;

    /** True when a valid token exists in storage and currentUser is set. */
    isAuthenticated: boolean;

    /**
     * Called by LoginPage after a successful authService.login() response.
     * Stores the token via tokenStorage, decodes the JWT to extract userId,
     * and updates currentUser state.
     * AuthContext never calls authService — it only receives the result.
     */
    login: (response: AuthenticatedResponse) => void;

    /**
     * Clears the token from storage and resets currentUser to null.
     * Used by logout buttons and 401 interceptors.
     */
    logout: () => void;

    /**
     * Returns the role-specific default dashboard path for the current user.
     * Returns "/" if unauthenticated.
     */
    getDashboardPath: () => string;
}

/**
 * Maps a role string to its default dashboard route.
 * Centralised here so ProtectedRoute and LoginPage both use the same logic.
 */
export function getRoleDashboardPath(role: string | undefined | null): string {
    switch (role) {
        case "Admin":
            return "/dashboard";
        case "Doctor":
            return "/dashboard";
        case "Receptionist":
            return "/dashboard";
        case "Patient":
            return "/patient/appointments";
        default:
            return "/";
    }
}

/**
 * The React context object.
 *
 * Default value is null — consumers MUST be wrapped in AuthProvider.
 * useAuth() enforces this with a runtime guard.
 */
const AuthContext = createContext<AuthContextValue | null>(null);

export default AuthContext;
