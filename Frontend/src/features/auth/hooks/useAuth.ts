import { useContext } from "react";

import AuthContext, { type AuthContextValue } from "../context/AuthContext";

/**
 * useAuth
 *
 * The only way consumers should access authentication state.
 *
 * Rules:
 *  - Never write useContext(AuthContext) outside this file.
 *  - Throws if called outside of AuthProvider — fails loudly
 *    at development time instead of silently returning undefined.
 *
 * Usage:
 *
 *   const { currentUser, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return context;
}
