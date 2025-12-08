import { fetchInstance } from "./clients";
import { getAuthToken } from "./functions";

/**
 * Checks if the user is authenticated by verifying the auth token and making a profile API call.
 * @returns {Promise<boolean>} True if the user is authenticated, false otherwise.
 */
export const IsUserAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  if (token) {
    const response = await fetchInstance("/auth/profile");

    if (response.status === 200) {
      return true;
    }
    return false;
  }
  return false;
};

/**
 * Logs out the user by removing the auth token and redirecting to the login page.
 */
export const logout = () => {
  if (typeof window !== "undefined") {
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  }
};
