import { createContext } from "react";

import type { AuthenticatedResponse } from "../types/authenticatedResponse";

/**
 * The shape of a resolved user session.
 *
 * Derived from AuthenticatedResponse — only the fields the application
 * needs to know about the currently logged-in user.
 *
 * Does NOT store the raw AccessToken. The token is managed separately
 * by tokenStorage and never exposed to UI consumers.
 */
export interface AuthUser {
    userName: string;
    email: string;
    fullName: string;
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
     * Stores the token via tokenStorage and updates currentUser state.
     * AuthContext never calls authService — it only receives the result.
     */
    login: (response: AuthenticatedResponse) => void;

    /**
     * Clears the token from storage and resets currentUser to null.
     * Used by logout buttons and 401 interceptors.
     */
    logout: () => void;
}

/**
 * The React context object.
 *
 * Default value is null — consumers MUST be wrapped in AuthProvider.
 * useAuth() enforces this with a runtime guard.
 */
const AuthContext = createContext<AuthContextValue | null>(null);

export default AuthContext;
