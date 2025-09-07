import { MovieCategory } from "@/types/movie";
import { CATEGORY_THEMES } from "./constants";

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
