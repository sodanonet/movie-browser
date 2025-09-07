import "@testing-library/jest-dom";
import React from "react";

// Mock environment variables for tests (must be set before importing API modules)
process.env.VITE_TMDB_API_KEY = "test-api-key";
process.env.VITE_API_BASE_URL = "https://api.themoviedb.org/3";

// Mock React Router hooks for testing
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
    key: "default",
  }),
  useParams: () => ({}),
  Link: ({ children, to, ...props }: any) =>
    React.createElement("a", { href: to, ...props }, children),
  NavLink: ({ children, to, ...props }: any) =>
    React.createElement("a", { href: to, ...props }, children),
}));

// Mock TMDB API functions for testing
jest.mock("../services/tmdbApi", () => ({
  fetchMovies: jest.fn(),
  fetchMovieDetail: jest.fn(),
  searchMovies: jest.fn(),
  getImageUrl: jest.fn((path: string | null) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : "/placeholder.jpg"
  ),
  getBackdropUrl: jest.fn((path: string | null) =>
    path
      ? `https://image.tmdb.org/t/p/w1280${path}`
      : "/placeholder-backdrop.jpg"
  ),
  formatRating: jest.fn((rating: number) => rating.toString()),
  formatRuntime: jest.fn((minutes: number | null) =>
    minutes ? `${minutes}m` : "Unknown"
  ),
  formatReleaseDate: jest.fn((date: string) => date),
  formatCurrency: jest.fn((amount: number) => `$${amount.toLocaleString()}`),
}));

// Mock IntersectionObserver for components that use it
(global as any).IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;
