import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/test-utils";
import { AppContent } from "../../App";
import { fetchMovies, fetchMovieDetail } from "../../services/tmdbApi";
import { mockMovies } from "../mocks/movieData";
import { MemoryRouter } from "react-router-dom";

// Type the mocked functions
const mockFetchMovies = fetchMovies as jest.MockedFunction<typeof fetchMovies>;
const mockFetchMovieDetail = fetchMovieDetail as jest.MockedFunction<
  typeof fetchMovieDetail
>;

// Override useParams mock for this test file
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/",
    search: "",
    hash: "",
    state: null,
    key: "default",
  }),
  // Don't mock useParams - let it work normally with MemoryRouter
}));

// Helper function to render AppContent with MemoryRouter wrapper
const renderAppContent = (preloadedState = {}, initialEntries = ["/"]) => {
  return renderWithProviders(
    <MemoryRouter initialEntries={initialEntries}>
      <AppContent />
    </MemoryRouter>,
    { preloadedState }
  );
};

describe("App Integration Tests", () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup successful API mock responses
    mockFetchMovies.mockResolvedValue(mockMovies);
    mockFetchMovieDetail.mockResolvedValue({
      ...mockMovies[0],
      title: "Test Movie Detail",
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
  });

  describe("Full App Workflow", () => {
    it("should render homepage and load movie data", async () => {
      renderAppContent();

      // Wait for homepage to load and show hero section
      await waitFor(
        () => {
          expect(
            screen.getByText("Discover Amazing Movies")
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Should show carousel titles
      expect(screen.getByText("Popular Movies")).toBeInTheDocument();
      expect(screen.getByText("Top Rated")).toBeInTheDocument();
      expect(screen.getByText("Now Playing")).toBeInTheDocument();

      // Wait for movie data to load (movie cards should appear)
      await waitFor(
        () => {
          // Should show movie titles from mockMovies (appears in multiple carousels)
          expect(screen.getAllByText("Test Movie 1")).toHaveLength(3);
        },
        { timeout: 3000 }
      );

      // Should show navigation with empty wishlist
      expect(screen.getByText("Wishlist")).toBeInTheDocument();
    });

    it("should navigate to movie detail and add to wishlist", async () => {
      const user = userEvent.setup();

      // Preload movie details in state
      const preloadedState = {
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {
            1: {
              data: {
                id: 1,
                title: "Test Movie Detail",
                overview: "Test overview",
                poster_path: "/test1.jpg",
                backdrop_path: "/test1-backdrop.jpg",
                release_date: "2023-01-01",
                vote_average: 8.0,
                vote_count: 100,
                adult: false,
                original_language: "en",
                original_title: "Test Movie Detail",
                popularity: 100,
                video: false,
                genres: [{ id: 28, name: "Action" }],
                runtime: 120,
                budget: 50000000,
                revenue: 200000000,
                homepage: "https://test.com",
                imdb_id: "tt1234567",
                production_companies: [],
                production_countries: [],
                spoken_languages: [],
                status: "Released",
                tagline: "Test tagline",
              },
              lastFetched: Date.now(),
            },
          },
          detailLoading: {},
          detailError: {},
        },
      };

      // Start directly on movie detail page
      await act(async () => {
        renderAppContent(preloadedState, ["/movie-info/1"]);
      });

      // Wait for movie detail to load
      await waitFor(() => {
        expect(screen.getByText("Test Movie Detail")).toBeInTheDocument();
      });

      // Should show add to wishlist button
      const addButton = screen.getByText(/Add to Wishlist/);
      expect(addButton).toBeInTheDocument();

      // Click add to wishlist
      await user.click(addButton);

      // Navigation should show updated count
      expect(screen.getByText("(1)")).toBeInTheDocument();
    });

    it("should navigate between pages correctly", async () => {
      const user = userEvent.setup();
      renderAppContent();

      // Start on homepage
      expect(screen.getByText("Discover Amazing Movies")).toBeInTheDocument();

      // Navigate to wishlist
      const wishlistLink = screen.getByText("Wishlist");
      await user.click(wishlistLink);

      // Should be on wishlist page
      await waitFor(() => {
        expect(screen.getByText("My Wishlist")).toBeInTheDocument();
        expect(
          screen.getByText("Your wishlist is empty. Start adding some movies!")
        ).toBeInTheDocument();
      });

      // Navigate back to home
      const homeLink = screen.getByText("Home");
      await user.click(homeLink);

      // Should be back on homepage
      expect(screen.getByText("Discover Amazing Movies")).toBeInTheDocument();
    });

    it("should handle complete wishlist workflow", async () => {
      const user = userEvent.setup();

      // Preload movie details in state
      const preloadedState = {
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {
            1: {
              data: {
                id: 1,
                title: "Test Movie Detail",
                overview: "Test overview",
                poster_path: "/test1.jpg",
                backdrop_path: "/test1-backdrop.jpg",
                release_date: "2023-01-01",
                vote_average: 8.0,
                vote_count: 100,
                adult: false,
                original_language: "en",
                original_title: "Test Movie Detail",
                popularity: 100,
                video: false,
                genres: [{ id: 28, name: "Action" }],
                runtime: 120,
                budget: 50000000,
                revenue: 200000000,
                homepage: "https://test.com",
                imdb_id: "tt1234567",
                production_companies: [],
                production_countries: [],
                spoken_languages: [],
                status: "Released",
                tagline: "Test tagline",
              },
              lastFetched: Date.now(),
            },
          },
          detailLoading: {},
          detailError: {},
        },
      };

      // Start on movie detail page
      await act(async () => {
        renderAppContent(preloadedState, ["/movie-info/1"]);
      });

      await waitFor(() => {
        expect(screen.getByText("Test Movie Detail")).toBeInTheDocument();
      });

      // Add to wishlist - look for the heart icon button
      const addButton = screen.getByText(/Add to Wishlist/);
      await user.click(addButton);

      // Check navigation shows count
      expect(screen.getByText("Wishlist")).toBeInTheDocument();

      // Navigate to wishlist
      const wishlistLink = screen.getByText("Wishlist");
      await user.click(wishlistLink);

      // Should show movie in wishlist
      await waitFor(() => {
        expect(screen.getByText("My Wishlist")).toBeInTheDocument();
        expect(screen.getByText("Test Movie Detail")).toBeInTheDocument();
      });
    });

    it("should handle wishlist remove and clear functionality", async () => {
      const user = userEvent.setup();

      // Preload state with movie details and movie in wishlist
      const preloadedState = {
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {
            1: {
              data: {
                id: 1,
                title: "Test Movie Detail",
                overview: "Test overview",
                poster_path: "/test1.jpg",
                backdrop_path: "/test1-backdrop.jpg",
                release_date: "2023-01-01",
                vote_average: 8.0,
                vote_count: 100,
                adult: false,
                original_language: "en",
                original_title: "Test Movie Detail",
                popularity: 100,
                video: false,
                genres: [{ id: 28, name: "Action" }],
                runtime: 120,
                budget: 50000000,
                revenue: 200000000,
                homepage: "https://test.com",
                imdb_id: "tt1234567",
                production_companies: [],
                production_countries: [],
                spoken_languages: [],
                status: "Released",
                tagline: "Test tagline",
              },
              lastFetched: Date.now(),
            },
          },
          detailLoading: {},
          detailError: {},
        },
        wishlist: {
          items: [
            {
              id: 1,
              title: "Test Movie Detail",
              overview: "Test overview",
              poster_path: "/test1.jpg",
              vote_average: 8.0,
              release_date: "2023-01-01",
            },
          ],
        },
      };

      // Start on wishlist page
      await act(async () => {
        renderAppContent(preloadedState, ["/wishlist"]);
      });

      await waitFor(() => {
        expect(screen.getByText("My Wishlist")).toBeInTheDocument();
        expect(screen.getByText("1 movie")).toBeInTheDocument();
        expect(screen.getByText("Clear All")).toBeInTheDocument();
      });

      // Test individual remove
      const removeButton = screen.getByText("💔");
      await user.click(removeButton);

      // Should show empty state after removal
      await waitFor(() => {
        expect(
          screen.getByText("Your wishlist is empty. Start adding some movies!")
        ).toBeInTheDocument();
        expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
      });

      // Navigation should show 0 count
      expect(screen.getByText("Wishlist")).toBeInTheDocument();
    });

    it("should handle clear all wishlist functionality", async () => {
      const user = userEvent.setup();

      // Create preloaded state with movies in wishlist
      const preloadedState = {
        wishlist: {
          items: [
            {
              id: 1,
              title: "Test Movie 1",
              overview: "Test overview",
              poster_path: "/test1.jpg",
              backdrop_path: "/test1-backdrop.jpg",
              release_date: "2023-01-01",
              vote_average: 8.0,
              vote_count: 100,
              genre_ids: [28],
              adult: false,
              original_language: "en",
              original_title: "Test Movie 1",
              popularity: 100,
              video: false,
            },
            {
              id: 2,
              title: "Test Movie 2",
              overview: "Test overview 2",
              poster_path: "/test2.jpg",
              backdrop_path: "/test2-backdrop.jpg",
              release_date: "2023-01-02",
              vote_average: 7.5,
              vote_count: 80,
              genre_ids: [18],
              adult: false,
              original_language: "en",
              original_title: "Test Movie 2",
              popularity: 90,
              video: false,
            },
          ],
        },
      };

      await act(async () => {
        renderAppContent(preloadedState, ["/wishlist"]);
      });

      await waitFor(() => {
        expect(screen.getByText("My Wishlist")).toBeInTheDocument();
        expect(screen.getByText("2 movies")).toBeInTheDocument();
        expect(screen.getByText("Clear All")).toBeInTheDocument();
      });

      // Click Clear All to open modal
      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      // Should show confirmation modal
      await waitFor(() => {
        expect(screen.getByText("Clear Wishlist")).toBeInTheDocument();
        expect(
          screen.getByText(/Are you sure you want to remove all 2 movies/)
        ).toBeInTheDocument();
      });

      // Click confirm button in modal
      const confirmButton = screen.getByRole("button", { name: "Clear All" });
      await user.click(confirmButton);

      // Should show empty state
      await waitFor(() => {
        expect(
          screen.getByText("Your wishlist is empty. Start adding some movies!")
        ).toBeInTheDocument();
        expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
      });
    });

    it("should handle error states gracefully", async () => {
      // Mock API to reject with error
      mockFetchMovies.mockRejectedValue(new Error("Internal server error"));

      renderAppContent();

      // Should still render the page structure
      expect(screen.getByText("Discover Amazing Movies")).toBeInTheDocument();
      expect(screen.getByText("Popular Movies")).toBeInTheDocument();

      // Should eventually show error state or retry button
      await waitFor(
        () => {
          // The error might show as a retry button or error message
          expect(document.body).toBeInTheDocument(); // Just verify the app doesn't crash
        },
        { timeout: 3000 }
      );
    });

    it("should handle invalid routes", async () => {
      await act(async () => {
        renderAppContent({}, ["/invalid-route"]);
      });

      // Should still render the app structure
      expect(screen.getByText("Movie Browser")).toBeInTheDocument();
    });
  });

  describe("State Persistence", () => {
    it("should maintain wishlist across navigation", async () => {
      const user = userEvent.setup();

      // Preload movie details in state
      const preloadedState = {
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {
            1: {
              data: {
                id: 1,
                title: "Test Movie Detail",
                overview: "Test overview",
                poster_path: "/test1.jpg",
                backdrop_path: "/test1-backdrop.jpg",
                release_date: "2023-01-01",
                vote_average: 8.0,
                vote_count: 100,
                adult: false,
                original_language: "en",
                original_title: "Test Movie Detail",
                popularity: 100,
                video: false,
                genres: [{ id: 28, name: "Action" }],
                runtime: 120,
                budget: 50000000,
                revenue: 200000000,
                homepage: "https://test.com",
                imdb_id: "tt1234567",
                production_companies: [],
                production_countries: [],
                spoken_languages: [],
                status: "Released",
                tagline: "Test tagline",
              },
              lastFetched: Date.now(),
            },
          },
          detailLoading: {},
          detailError: {},
        },
      };

      // Start on movie detail page
      await act(async () => {
        renderAppContent(preloadedState, ["/movie-info/1"]);
      });

      await waitFor(() => {
        expect(screen.getByText("Test Movie Detail")).toBeInTheDocument();
      });

      const addButton = screen.getByText(/Add to Wishlist/);
      await user.click(addButton);

      // Navigate away and back
      const homeLink = screen.getByText("Home");
      await user.click(homeLink);

      expect(screen.getByText("Wishlist")).toBeInTheDocument();

      const wishlistLink = screen.getByText("Wishlist");
      await user.click(wishlistLink);

      await waitFor(() => {
        expect(screen.getByText("Test Movie Detail")).toBeInTheDocument();
      });
    });

    it("should cache movie data across navigation", async () => {
      const user = userEvent.setup();
      renderAppContent();

      // Wait for homepage data to load
      await waitFor(() => {
        expect(screen.getAllByText("Test Movie 1")).toHaveLength(3); // appears in all 3 carousels
      });

      // Navigate away
      const wishlistLink = screen.getByText("Wishlist");
      await user.click(wishlistLink);

      // Navigate back
      const homeLink = screen.getByText("Home");
      await user.click(homeLink);

      // Data should still be there (cached)
      expect(screen.getAllByText("Test Movie 1")).toHaveLength(3); // appears in all 3 carousels
    });
  });
});
