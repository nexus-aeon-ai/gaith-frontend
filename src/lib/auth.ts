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