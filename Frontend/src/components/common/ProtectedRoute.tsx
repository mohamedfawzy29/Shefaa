import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/hooks/useAuth";
import { getRoleDashboardPath } from "../../features/auth/context/AuthContext";
import type { UserRole } from "../../api/endpoints";

/**
 * ProtectedRoute
 *
 * A two-stage route guard:
 *
 *  Stage 1 — Authentication check:
 *    Redirects unauthenticated users to /login.
 *
 *  Stage 2 — Authorization check (optional):
 *    When `allowedRoles` is provided, redirects authenticated users
 *    whose role is NOT in the list to their own role dashboard,
 *    rather than a generic "/" path. This prevents a Patient from
 *    landing on the wrong page when they try to access /dashboard.
 *
 * Rules:
 *  - Reads ONLY isAuthenticated and currentUser.role from useAuth().
 *  - Never inspects the raw JWT token directly.
 *  - Never calls localStorage, tokenStorage, or Axios.
 *  - No business logic. No side effects. Pure routing.
 */

interface ProtectedRouteProps {
    /** When provided, only users with one of these roles may access the route. */
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, currentUser } = useAuth();

    // ── Stage 1: Must be authenticated ────────────────────────────────────────
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ── Stage 2: Must have an allowed role (if roles are restricted) ──────────
    if (allowedRoles && currentUser?.role && !allowedRoles.includes(currentUser.role as UserRole)) {
        // Redirect to the user's own dashboard instead of a generic fallback.
        // This gives a better UX: a Patient navigating to /dashboard is
        // seamlessly sent to /patient/appointments instead of the home page.
        const redirectTo = getRoleDashboardPath(currentUser.role);
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
}
