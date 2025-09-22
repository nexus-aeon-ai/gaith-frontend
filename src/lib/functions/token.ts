/**
 * Token management utilities for authentication.
 * Handles getting the auth token from cookies (client/server) and checking authentication state.
 */

/**
 * Retrieves the authentication token from cookies (client or server).
 * @returns {Promise<string | null>} The auth token if present, otherwise null.
 */
export const getAuthToken = async (): Promise<string | null> => {
  if (typeof window !== "undefined") {
    // Client-side
    const match = document.cookie.match(/(^| )authToken=([^;]+)/);
    return match ? match[2] : null;
  }

  // Server-side
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value || null;
};
