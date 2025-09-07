// Cache duration constants (in milliseconds)
export const CACHE_DURATION = {
  FILMS: 5 * 60 * 1000, // 5 minutes
  FILM_DETAIL: 30 * 60 * 1000, // 30 minutes
  SEARCH_RESULTS: 2 * 60 * 1000, // 2 minutes
} as const;

// Film category display names
export const CATEGORY_NAMES = {
  popular: "Popular Movies",
  top_rated: "Top Rated",
  now_playing: "Now Playing",
} as const;

// Film category themes for styling
export const CATEGORY_THEMES = {
  popular: "popular",
  top_rated: "top-rated",
  now_playing: "now-playing",
} as const;

// Image size constants
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w185",
    MEDIUM: "w300",
    LARGE: "w500",
    XLARGE: "w780",
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
  },
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  MEDIUM: 300,
  SLOW: 500,
} as const;

// Breakpoints (should match SCSS variables)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  WISHLIST: "movieBrowser_wishlist",
  THEME: "movieBrowser_theme",
  LAST_VISITED_FILM: "movieBrowser_lastMovie",
} as const;
