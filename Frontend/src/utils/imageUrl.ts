/**
 * Utility for constructing full URLs for backend static assets (specialization icons, profile images, etc.)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7118/api";

/**
 * Strips `/api` from VITE_API_BASE_URL to obtain the root origin (e.g., https://localhost:7118)
 */
export function getServerBaseUrl(): string {
    return API_BASE_URL.replace(/\/api\/?$/, "");
}

/**
 * Generic helper to construct static image URLs from wwwroot/images/{folder}/{fileName}.
 * Returns `null` if the filename is empty, undefined, or matches 'default.png', allowing UI components
 * to render their default fallback icon/avatar cleanly.
 */
export function getImageUrl(folder: string, fileName?: string | null): string | null {
    if (!fileName || fileName.trim() === "" || fileName.toLowerCase() === "default.png") {
        return null;
    }
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
        return fileName;
    }
    const cleanFileName = fileName.startsWith("/") ? fileName.slice(1) : fileName;
    return `${getServerBaseUrl()}/images/${folder}/${cleanFileName}`;
}

/**
 * Specialized helper for Specialization icons stored in wwwroot/images/specializations
 */
export function getSpecializationIconUrl(iconImg?: string | null): string | null {
    return getImageUrl("specializations", iconImg);
}

/**
 * Specialized helper for Profile images stored in wwwroot/images/profiles
 */
export function getProfileImageUrl(profileImgUrl?: string | null): string | null {
    return getImageUrl("profiles", profileImgUrl);
}
