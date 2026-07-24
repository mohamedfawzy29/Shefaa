import { useState, useCallback, type ReactNode } from "react";

import AuthContext, { type AuthUser, getRoleDashboardPath } from "../../features/auth/context/AuthContext";
import type { AuthenticatedResponse } from "../../features/auth/types/authenticatedResponse";
import {
    saveAccessToken,
    getAccessToken,
    removeAccessToken,
    saveUserData,
    getUserData,
    removeUserData,
} from "../../utils/tokenStorage";
import { getUserIdFromToken, getUserRoleFromToken, normalizeRole, isTokenExpired } from "../../utils/jwtUtils";

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Derives a UI-safe AuthUser from a backend AuthenticatedResponse.
 *
 * The userId is extracted from the JWT payload (`sub` / nameidentifier claim)
 * rather than the response body, since ASP.NET Identity embeds it there.
 * The AccessToken itself is intentionally excluded from the returned object —
 * it is persisted to storage by tokenStorage and never surfaced to UI components.
 */
function buildAuthUser(response: AuthenticatedResponse): AuthUser {
    const userId = getUserIdFromToken(response.accessToken);
    const tokenRole = getUserRoleFromToken(response.accessToken);
    const role = tokenRole || normalizeRole(response.role);
    return {
        userId,
        userName: response.userName,
        email: response.email,
        fullName: response.fullName,
        role,
    };
}

/**
 * Attempts to restore a user session from storage on app startup.
 *
 * Returns null if:
 *  - No token is present in storage
 *  - The stored token has expired
 *  - No user data is persisted alongside the token
 */
function restoreUserFromStorage(): AuthUser | null {
    const token = getAccessToken();

    if (!token || isTokenExpired(token)) {
        // Expired / missing — clean up stale data
        if (token) {
            removeAccessToken();
            removeUserData();
        }
        return null;
    }

    return getUserData<AuthUser>();
}

/**
 * AuthProvider
 *
 * Owns authentication state for the entire application.
 *
 * Responsibilities:
 *  ✔ currentUser state (includes userId extracted from JWT)
 *  ✔ isAuthenticated derived from currentUser
 *  ✔ login(response) — receives the result of authService.login()
 *  ✔ logout() — clears state and storage
 *  ✔ getDashboardPath() — returns role-appropriate dashboard route
 *
 * Never:
 *  ✗ calls authService directly
 *  ✗ calls Axios directly
 *  ✗ calls localStorage directly (delegates to tokenStorage)
 *  ✗ performs navigation (navigation is the caller's responsibility)
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(
        restoreUserFromStorage,
    );

    /**
     * Called by LoginPage after a successful authService.login() call.
     * Stores the token, decodes the JWT to extract userId, and sets state.
     */
    const login = useCallback((response: AuthenticatedResponse): void => {
        saveAccessToken(response.accessToken);
        const user = buildAuthUser(response);
        saveUserData(user);
        setCurrentUser(user);
    }, []);

    /**
     * Clears the stored token and removes the current user from state.
     * The application will re-render and treat the user as unauthenticated.
     */
    const logout = useCallback((): void => {
        removeAccessToken();
        removeUserData();
        setCurrentUser(null);
    }, []);

    /**
     * Returns the role-specific default dashboard path.
     * Delegates to the centralised helper in AuthContext so routing logic
     * is defined in one place.
     */
    const getDashboardPath = useCallback((): string => {
        return getRoleDashboardPath(currentUser?.role);
    }, [currentUser?.role]);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: currentUser !== null,
                login,
                logout,
                getDashboardPath,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
