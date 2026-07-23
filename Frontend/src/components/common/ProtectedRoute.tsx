import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/hooks/useAuth";

/**
 * ProtectedRoute
 *
 * Guards a route tree behind authentication.
 * Renders child routes when the user is authenticated.
 * Redirects to /login when the user is not.
 *
 * Rules:
 *  - Reads ONLY isAuthenticated from useAuth().
 *  - Never inspects the token.
 *  - Never calls localStorage or tokenStorage.
 *  - Never calls Axios or authService.
 *  - No business logic. No side effects.
 */
export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
