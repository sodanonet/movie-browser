import "whatwg-fetch";
import { TextEncoder, TextDecoder } from "util";

// Global polyfills for Node.js environment
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// Mock import.meta for Jest - must be set before any modules are loaded
(global as any).importMeta = {
  env: {
    VITE_TMDB_API_KEY: "test-api-key",
    VITE_API_BASE_URL: "https://api.themoviedb.org/3",
    VITE_APP_TITLE: "Film Browser",
  },
};
