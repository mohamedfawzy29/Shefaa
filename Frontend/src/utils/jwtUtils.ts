/**
 * jwtUtils
 *
 * Lightweight JWT payload decoder — NO third-party library required.
 *
 * Decodes the base64url-encoded payload segment of a JWT and returns
 * the parsed claims object.
 *
 * Rules:
 *  - Never used to VERIFY a JWT (that is the backend's responsibility).
 *  - Only used to READ display-safe claims (userId, email, role, exp).
 *  - Returns null on any malformed input instead of throwing.
 */

/** Standard JWT registered claims + common custom claims */
export interface JwtPayload {
    /** Subject — typically the user's ID (UUID) */
    sub?: string;
    /** Expiration time (Unix epoch seconds) */
    exp?: number;
    /** Issued-at time (Unix epoch seconds) */
    iat?: number;
    /** JWT ID */
    jti?: string;
    /** Email address */
    email?: string;
    /** .NET ClaimTypes.NameIdentifier — used by ASP.NET Identity */
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
    /** .NET ClaimTypes.Name */
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
    /** .NET ClaimTypes.Email */
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
    /** .NET ClaimTypes.Role — may be a single string or array of strings */
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
    /** Short-form role claim used by some issuers */
    role?: string | string[];
    /** Plural roles claim */
    roles?: string | string[];
    /** Allow any additional claims */
    [key: string]: unknown;
}

/**
 * Decodes the payload of a JWT token and returns the parsed claims.
 *
 * @param token - A raw JWT string (header.payload.signature)
 * @returns Parsed JwtPayload, or null if the token is malformed / empty.
 */
export function decodeJwtPayload(token: string | null | undefined): JwtPayload | null {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    try {
        // base64url → base64 → JSON
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                .join(""),
        );
        return JSON.parse(jsonStr) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Normalizes role string to exact system case: "Admin", "Doctor", "Patient", "Receptionist".
 */
export function normalizeRole(rawRole: string | undefined | null): string {
    if (!rawRole) return "";
    const clean = rawRole.trim();
    const lower = clean.toLowerCase();

    if (lower === "admin") return "Admin";
    if (lower === "doctor") return "Doctor";
    if (lower === "patient") return "Patient";
    if (lower === "receptionist") return "Receptionist";

    // Fallback: title-case first letter
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Extracts and resolves user role from JWT token claims.
 * Checks ASP.NET XML Schema claim, standard 'role', and 'roles'.
 */
export function getUserRoleFromToken(token: string | null | undefined): string | null {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    const raw =
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
        payload.role ??
        payload.roles;

    if (!raw) return null;

    if (Array.isArray(raw)) {
        const found = raw.find((r) => typeof r === "string" && r.length > 0);
        return found ? normalizeRole(found) : null;
    }

    if (typeof raw === "string") {
        return normalizeRole(raw);
    }

    return null;
}

/**
 * Extracts the user ID from a JWT token.
 * Checks both `sub` and the ASP.NET Identity `nameidentifier` claim.
 *
 * @returns The userId string, or null if not found.
 */
export function getUserIdFromToken(token: string | null | undefined): string | null {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;

    return (
        (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string) ??
        payload.sub ??
        null
    );
}

/**
 * Returns true if the JWT token has expired (or is malformed).
 * Adds a 10-second clock-skew buffer.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowSeconds - 10;
}
