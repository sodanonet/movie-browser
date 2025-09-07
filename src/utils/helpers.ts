import { MovieCategory } from "@/types/movie";
import { CATEGORY_THEMES, CACHE_DURATION } from "./constants";

/**
 * Returns the theme associated with a given movie category.
 *
 * @param category - The movie category for which to retrieve the theme.
 * @returns The theme string corresponding to the provided category, or "popular" if the category is not found.
 */
export const getCategoryTheme = (category: MovieCategory): string => {
  return CATEGORY_THEMES[category] || "popular";
};

/**
 * Determines whether the cache is still valid based on the last fetched timestamp and a specified duration.
 *
 * @param lastFetched - The timestamp (in milliseconds) when the data was last fetched.
 * @param duration - The cache validity duration in milliseconds. Defaults to `CACHE_DURATION.MOVIES` if not provided.
 * @returns `true` if the cache is still valid; otherwise, `false`.
 */
export const isCacheValid = (
  lastFetched: number,
  duration: number = CACHE_DURATION.MOVIES
): boolean => {
  return Date.now() - lastFetched < duration;
};

/**
 * Logs application errors to the console and, in production, can send them to an external error tracking service.
 *
 * @param error - The error object to log.
 * @param errorInfo - Optional additional information about the error.
 */
export const logError = (error: Error, errorInfo?: unknown): void => {
  console.error("🔥 Application Error:", error);
  if (errorInfo) {
    console.error("Error Info:", errorInfo);
  }

  // In production, you might want to send errors to a service like Sentry
  if (process.env.NODE_ENV === "production") {
    // sendErrorToService(error, errorInfo)
  }
};
