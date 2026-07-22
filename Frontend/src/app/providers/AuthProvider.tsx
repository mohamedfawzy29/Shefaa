import { useState, useCallback, type ReactNode } from "react";

import AuthContext, { type AuthUser } from "../../features/auth/context/AuthContext";
import type { AuthenticatedResponse } from "../../features/auth/types/authenticatedResponse";
import {
    saveAccessToken,
    getAccessToken,
    removeAccessToken,
    saveUserData,
    getUserData,
    removeUserData,
} from "../../utils/tokenStorage";

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Derives a UI-safe AuthUser from a backend AuthenticatedResponse.
 *
 * The AccessToken is intentionally excluded — it is persisted to storage
 * by tokenStorage and never surfaced to UI components.
 */
function buildAuthUser(response: AuthenticatedResponse): AuthUser {
    return {
        userName: response.userName,
        email: response.email,
        fullName: response.fullName,
        role: response.role,
    };
}

/**
 * Attempts to restore a user session from storage on app startup.
 *
 * Returns null if no token is present — user must log in.
 */
function restoreUserFromStorage(): AuthUser | null {
    const token = getAccessToken();

    if (!token) {
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
 *  ✔ currentUser state
 *  ✔ isAuthenticated derived from currentUser
 *  ✔ login(response) — receives the result of authService.login()
 *  ✔ logout() — clears state and storage
 *
 * Never:
 *  ✗ calls authService directly
 *  ✗ calls Axios directly
 *  ✗ calls localStorage directly (delegates to tokenStorage)
 *  ✗ performs navigation
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(
        restoreUserFromStorage,
    );

    /**
     * Called by LoginPage after a successful authService.login() call.
     * Stores the token and sets the current user in state.
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

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: currentUser !== null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
