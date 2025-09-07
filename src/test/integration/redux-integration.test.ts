import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import wishlistSlice, {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import moviesSlice, {
  fetchPopularMovies,
  fetchMovieDetails,
} from "../../store/slices/moviesSlice";
import { mockMovies } from "../mocks/movieData";
import { fetchMovies, fetchMovieDetail } from "../../services/tmdbApi";
import type { RootState } from "../../store";

// Type the mocked functions
const mockFetchMovies = fetchMovies as jest.MockedFunction<typeof fetchMovies>;
const mockFetchMovieDetail = fetchMovieDetail as jest.MockedFunction<
  typeof fetchMovieDetail
>;

describe("Redux Integration Tests", () => {
  let store: EnhancedStore<RootState>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup successful API mock responses
    mockFetchMovies.mockResolvedValue(mockMovies);
    mockFetchMovieDetail.mockResolvedValue({
      ...mockMovies[0],
      runtime: 120,
      genres: [{ id: 28, name: "Action" }],
      production_companies: [],
      production_countries: [],
      spoken_languages: [],
      budget: 0,
      revenue: 0,
      status: "Released",
      tagline: "Test tagline",
      homepage: "",
      imdb_id: "tt1234567",
    } as any);

    store = configureStore({
      reducer: {
        wishlist: wishlistSlice,
        movies: moviesSlice,
      },
    });
  });

  describe("Movies Redux Integration", () => {
    it("should handle complete movie fetching flow", async () => {
      // Initial state should be empty
      expect(store.getState().movies.popular.data).toHaveLength(0);
      expect(store.getState().movies.popular.isLoading).toBe(false);

      // Dispatch async action
      await store.dispatch(fetchPopularMovies() as any);

      // Should have completed successfully

      // Should have data and not be loading
      const state = store.getState().movies.popular;
      expect(state.isLoading).toBe(false);
      expect(state.data).toHaveLength(3);
      expect(state.error).toBeNull();
      expect(state.lastFetched).toBeGreaterThan(0);
    });

    it("should handle movie detail fetching flow", async () => {
      const movieId = 1;

      // Initial state should be empty
      expect(store.getState().movies.movieDetails[movieId]).toBeUndefined();
      expect(store.getState().movies.detailLoading[movieId]).toBeUndefined();

      // Dispatch async action
      await store.dispatch(fetchMovieDetails(movieId) as any);

      // Should have completed successfully

      // Should have data and not be loading
      const state = store.getState().movies;
      expect(state.detailLoading[movieId]).toBe(false);
      expect(state.movieDetails[movieId]).toBeDefined();
      expect(state.movieDetails[movieId].data.id).toBe(movieId);
      expect(state.detailError[movieId]).toBeNull();
    });

    it("should cache movie data with timestamps", async () => {
      const beforeTime = Date.now();
      await store.dispatch(fetchPopularMovies() as any);
      const afterTime = Date.now();

      const state = store.getState().movies.popular;
      expect(state.lastFetched).toBeGreaterThanOrEqual(beforeTime);
      expect(state.lastFetched).toBeLessThanOrEqual(afterTime);
    });
  });

  describe("Wishlist Redux Integration", () => {
    it("should handle complete wishlist workflow", () => {
      const movie1 = mockMovies[0];
      const movie2 = mockMovies[1];

      // Initial state should be empty
      expect(store.getState().wishlist.items).toHaveLength(0);

      // Add first movie
      store.dispatch(addToWishlist(movie1));
      expect(store.getState().wishlist.items).toHaveLength(1);
      expect(store.getState().wishlist.items[0].id).toBe(movie1.id);

      // Add second movie
      store.dispatch(addToWishlist(movie2));
      expect(store.getState().wishlist.items).toHaveLength(2);

      // Try to add duplicate (should not add)
      store.dispatch(addToWishlist(movie1));
      expect(store.getState().wishlist.items).toHaveLength(2);

      // Remove first movie
      store.dispatch(removeFromWishlist(movie1.id));
      expect(store.getState().wishlist.items).toHaveLength(1);
      expect(store.getState().wishlist.items[0].id).toBe(movie2.id);
    });
  });

  describe("Cross-Slice Integration", () => {
    it("should allow adding fetched movies to wishlist", async () => {
      // Fetch movies first
      await store.dispatch(fetchPopularMovies() as any);
      const movies = store.getState().movies.popular.data;

      // Add first movie to wishlist
      store.dispatch(addToWishlist(movies[0]));

      // Verify movie is in both places
      expect(store.getState().movies.popular.data[0].id).toBe(movies[0].id);
      expect(store.getState().wishlist.items[0].id).toBe(movies[0].id);
    });

    it("should maintain separate state for different movie categories", async () => {
      // Dispatch all three categories
      await Promise.all([
        store.dispatch(fetchPopularMovies() as any),
        store.dispatch(fetchMovieDetails(1) as any),
      ]);

      const state = store.getState().movies;

      // Each category should have its own state
      expect(state.popular.data).toHaveLength(3);
      expect(state.movieDetails[1]).toBeDefined();

      // States should be independent
      expect(state.popular.isLoading).toBe(false);
      expect(state.detailLoading[1]).toBe(false);
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle API errors in Redux flow", async () => {
      // Mock API to reject with error
      mockFetchMovies.mockRejectedValue(new Error("Internal server error"));

      await store.dispatch(fetchPopularMovies() as any);

      const state = store.getState().movies.popular;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeTruthy(); // Should have error message
      expect(state.data).toHaveLength(0); // No data on error
    });
  });
});
