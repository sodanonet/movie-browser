import axios, { AxiosError } from "axios";
import {
  Movie,
  MovieDetail,
  TMDBResponse,
  MovieCategory,
} from "../types/movie";

// Environment variable handling for Vite
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "test-api-key";

// API validation
if (!API_KEY || API_KEY === "your_tmdb_api_key_here") {
  console.warn(
    "TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file."
  );
}

// Create axios instance with configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const errorMessage = getErrorMessage(error);
    console.error("❌ TMDB API Error:", errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Error message helper
/**
 * Returns a user-friendly error message based on the provided Axios error.
 *
 * Handles specific HTTP status codes from TMDB API responses and provides
 * descriptive messages for common error scenarios such as invalid API keys,
 * resource not found, rate limiting, and server errors. Also handles network
 * errors and unknown errors.
 *
 * @param error - The AxiosError object received from a failed HTTP request.
 * @returns A string describing the error in a user-friendly way.
 */
function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as unknown as { status_message?: string };

    switch (status) {
      case 401:
        return "Invalid API key. Please check your TMDB API configuration.";
      case 404:
        return "Resource not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "TMDB server error. Please try again later.";
      default:
        return data?.status_message || `HTTP ${status}: ${error.message}`;
    }
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return error.message || "Unknown error occurred.";
  }
}

// Movie fetching functions
/**
 * Fetches a list of movies from the TMDB API for a given category and page.
 *
 * @param category - The movie category to fetch (e.g., "popular", "top_rated").
 * @param page - The page number to retrieve (defaults to 1).
 * @returns A promise that resolves to an array of valid movies.
 * @throws Will throw an error if the API response format is invalid or if the request fails.
 */
export const fetchMovies = async (
  category: MovieCategory,
  page: number = 1
): Promise<Movie[]> => {
  try {
    const response = await api.get<TMDBResponse<Movie>>(`/movie/${category}`, {
      params: {
        language: "en-US",
        page,
        region: "US",
      },
    });

    // Validate response structure
    if (!response.data || !Array.isArray(response.data.results)) {
      throw new Error("Invalid response format from TMDB API");
    }

    // Filter out movies without essential data
    const validMovies = response.data.results.filter(
      (movie) => movie.id && movie.title && movie.overview && movie.release_date
    );

    console.log(`📦 Fetched ${validMovies.length} ${category} movies`);
    return validMovies;
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    throw error;
  }
};

/**
 * Fetches detailed information about a movie from the TMDB API by its ID.
 *
 * @param movieId - The unique identifier of the movie to fetch details for.
 * @returns A promise that resolves to the {@link MovieDetail} object containing movie details.
 * @throws Will throw an error if the provided movie ID is invalid or if the API request fails.
 *
 * @example
 * ```typescript
 * const movie = await fetchMovieDetail(12345);
 * console.log(movie.title);
 * ```
 */
export const fetchMovieDetail = async (
  movieId: number
): Promise<MovieDetail> => {
  if (!movieId || isNaN(movieId)) {
    throw new Error("Invalid movie ID provided");
  }

  try {
    const response = await api.get<MovieDetail>(`/movie/${movieId}`, {
      params: {
        language: "en-US",
        append_to_response: "credits,videos,similar",
      },
    });

    // Validate essential movie detail properties
    const movie = response.data;
    if (!movie.id || !movie.title) {
      throw new Error("Invalid movie data received from TMDB API");
    }

    console.log(`🎬 Fetched details for: ${movie.title}`);
    return movie;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};

// Search movies functionality
/**
 * Searches for movies using the TMDB API based on the provided query string.
 *
 * @param query - The search term to query movies by title.
 * @param page - (Optional) The page number for paginated results. Defaults to 1.
 * @returns A promise that resolves to an array of valid `Movie` objects matching the search criteria.
 *
 * @throws Will throw an error if the API request fails.
 *
 * @remarks
 * - Trims the query string before searching.
 * - Returns an empty array if the query is empty or only whitespace.
 * - Filters out movies without an `id` or `title` from the results.
 * - Logs the number of found movies to the console.
 */
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<Movie[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await api.get<TMDBResponse<Movie>>("/search/movie", {
      params: {
        query: query.trim(),
        language: "en-US",
        page,
        include_adult: false,
      },
    });

    const validMovies = response.data.results.filter(
      (movie) => movie.id && movie.title
    );

    console.log(`🔍 Found ${validMovies.length} movies for query: "${query}"`);
    return validMovies;
  } catch (error) {
    console.error(`Error searching movies for query "${query}":`, error);
    throw error;
  }
};

// Image URL utilities
/**
 * Generates the full image URL for a given TMDB image path and size.
 *
 * @param path - The image path returned by TMDB API. If `null`, a placeholder image path is returned.
 * @param size - The desired image size. Can be one of: "w185", "w300", "w500", "w780", "w1280", or "original". Defaults to "w500".
 * @returns The full URL to the image, or a placeholder image path if `path` is `null`.
 */
export const getImageUrl = (
  path: string | null,
  size: "w185" | "w300" | "w500" | "w780" | "w1280" | "original" = "w500"
): string => {
  if (!path) return "/placeholder-movie.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Returns the full URL for a movie backdrop image from TMDB, or a placeholder if the path is null.
 *
 * @param path - The relative path to the backdrop image, or null if not available.
 * @param size - The desired image size. Can be "w300", "w780", "w1280", or "original". Defaults to "w1280".
 * @returns The full URL to the backdrop image, or a placeholder image path if `path` is null.
 */
export const getBackdropUrl = (
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
): string => {
  if (!path) return "/placeholder-backdrop.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Utility functions
/**
 * Formats a numeric rating to one decimal place and returns it as a string.
 *
 * @param rating - The numeric rating to format.
 * @returns The formatted rating as a string with one decimal place.
 */
export const formatRating = (rating: number): string => {
  return (Math.round(rating * 10) / 10).toString();
};

/**
 * Formats a runtime duration given in minutes into a human-readable string.
 *
 * @param minutes - The runtime in minutes, or `null` if unknown.
 * @returns A formatted string representing the runtime in hours and minutes (e.g., "2h 15m"),
 *          or "Runtime unknown" if the input is `null` or falsy.
 */
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return "Runtime unknown";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Formats a date string as a human-readable US date.
 * Returns the original string if formatting fails.
 *
 * @param dateString - The date string to format.
 * @returns The formatted date string or the original string if invalid.
 */
export const formatReleaseDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

/**
 * Formats a number as a USD currency string.
 * Returns "Unknown" if the amount is 0.
 *
 * @param amount - The amount to format as currency.
 * @returns The formatted currency string or "Unknown" if amount is 0.
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return "Unknown";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
