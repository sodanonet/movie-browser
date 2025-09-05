// API Configuration
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

// Image sizes
export const IMAGE_SIZES = {
  POSTER_SMALL: "w185",
  POSTER_MEDIUM: "w342",
  POSTER_LARGE: "w500",
  BACKDROP_MEDIUM: "w780",
  BACKDROP_LARGE: "w1280",
} as const;

// Movie categories
export const MOVIE_CATEGORIES = {
  POPULAR: "popular",
  TOP_RATED: "topRated",
  NOW_PLAYING: "nowPlaying",
} as const;

// Theme colors for categories
export const CATEGORY_THEMES = {
  popular: {
    primary: "#3b82f6",
    secondary: "#1d4ed8",
    light: "#dbeafe",
  },
  topRated: {
    primary: "#f59e0b",
    secondary: "#d97706",
    light: "#fef3c7",
  },
  nowPlaying: {
    primary: "#ef4444",
    secondary: "#dc2626",
    light: "#fee2e2",
  },
} as const;
