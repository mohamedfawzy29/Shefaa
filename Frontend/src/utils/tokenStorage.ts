/**
 * tokenStorage
 *
 * Single point of truth for JWT persistence.
 *
 * Rules:
 *  - Only this module is allowed to call localStorage (or any storage API).
 *  - No other file in the project may call localStorage.getItem / setItem / removeItem
 *    for token-related keys.
 *  - To migrate from localStorage to cookies, sessionStorage, or an in-memory
 *    store, modify only this file — nothing else changes.
 */

const TOKEN_KEY = "shefaa_access_token";
const USER_KEY = "shefaa_user";

/**
 * Persists the JWT access token to storage.
 * Called once after a successful login response.
 */
export function saveAccessToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Retrieves the stored JWT access token.
 * Returns null if no token is present (user is not authenticated).
 */
export function getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Removes the JWT access token from storage.
 * Called on logout or when a 401 response is received.
 */
export function removeAccessToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Persists the user details to storage.
 */
export function saveUserData(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Retrieves the stored user details.
 */
export function getUserData<T>(): T | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr) as T;
    } catch {
        return null;
    }
}

/**
 * Removes user details from storage.
 */
export function removeUserData(): void {
    localStorage.removeItem(USER_KEY);
}
