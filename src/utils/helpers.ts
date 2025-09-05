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
