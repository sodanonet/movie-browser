import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/utils/test-utils";
import WishlistPage from "../WishlistPage";
import { Movie } from "../../types/movie";

const mockMovie1: Movie = {
  id: 1,
  title: "Test Movie 1",
  overview:
    "This is a test overview for movie 1 that is long enough to test truncation functionality",
  poster_path: "/test1.jpg",
  backdrop_path: "/test1-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 1500,
  genre_ids: [28, 12],
  adult: false,
  original_language: "en",
  original_title: "Test Movie 1",
  popularity: 100,
  video: false,
};

const mockMovie2: Movie = {
  id: 2,
  title: "Test Movie 2",
  overview: "Short overview",
  poster_path: "/test2.jpg",
  backdrop_path: "/test2-backdrop.jpg",
  release_date: "2023-02-01",
  vote_average: 7.2,
  vote_count: 800,
  genre_ids: [18],
  adult: false,
  original_language: "en",
  original_title: "Test Movie 2",
  popularity: 85,
  video: false,
};

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("WishlistPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Empty Wishlist", () => {
    it("should display empty state when no items in wishlist", () => {
      const initialState = {
        wishlist: { items: [] },
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {},
          detailLoading: {},
          detailError: {},
        },
      };

      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      expect(screen.getByText("My Wishlist")).toBeInTheDocument();
      expect(
        screen.getByText("Your wishlist is empty. Start adding some movies!")
      ).toBeInTheDocument();
      expect(screen.getByText("Browse Movies")).toBeInTheDocument();
    });

    it("should navigate to homepage when clicking Browse Movies button", async () => {
      const user = userEvent.setup();
      const initialState = {
        wishlist: { items: [] },
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {},
          detailLoading: {},
          detailError: {},
        },
      };

      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      const browseButton = screen.getByText("Browse Movies");
      await user.click(browseButton);

      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should not show wishlist actions when empty", () => {
      const initialState = {
        wishlist: { items: [] },
        movies: {
          popular: { data: [], lastFetched: 0, isLoading: false, error: null },
          topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
          nowPlaying: {
            data: [],
            lastFetched: 0,
            isLoading: false,
            error: null,
          },
          movieDetails: {},
          detailLoading: {},
          detailError: {},
        },
      };

      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      expect(screen.queryByText("Clear All")).not.toBeInTheDocument();
      expect(screen.queryByText(/\d+ movie/)).not.toBeInTheDocument(); // Check for "X movie(s)" count
    });
  });

  describe("Wishlist with Items", () => {
    const initialState = {
      wishlist: { items: [mockMovie1, mockMovie2] },
      movies: {
        popular: { data: [], lastFetched: 0, isLoading: false, error: null },
        topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
        nowPlaying: { data: [], lastFetched: 0, isLoading: false, error: null },
        movieDetails: {},
        detailLoading: {},
        detailError: {},
      },
    };

    it("should display wishlist items", () => {
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      expect(screen.getByText("My Wishlist")).toBeInTheDocument();
      expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
      expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
    });

    it("should show correct movie count in header", () => {
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      expect(screen.getByText("2 movies")).toBeInTheDocument();
      expect(screen.getByText("Clear All")).toBeInTheDocument();
    });

    it("should show singular form for single movie", () => {
      const singleItemState = {
        ...initialState,
        wishlist: { items: [mockMovie1] },
      };

      renderWithProviders(<WishlistPage />, {
        preloadedState: singleItemState,
      });

      expect(screen.getByText("1 movie")).toBeInTheDocument();
    });

    it("should display movie information correctly", () => {
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      // Check movie titles
      expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
      expect(screen.getByText("Test Movie 2")).toBeInTheDocument();

      // Check ratings
      expect(screen.getByText("⭐ 8.5/10")).toBeInTheDocument();
      expect(screen.getByText("⭐ 7.2/10")).toBeInTheDocument();

      // Check years
      expect(screen.getAllByText("2023")).toHaveLength(2);

      // Check overview truncation
      expect(
        screen.getByText(
          /This is a test overview for movie 1 that is long enough to test truncation functionality/
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Short overview")).toBeInTheDocument();
    });

    it("should have poster images with correct alt text", () => {
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      const poster1 = screen.getByAltText("Test Movie 1 poster");
      const poster2 = screen.getByAltText("Test Movie 2 poster");

      expect(poster1).toBeInTheDocument();
      expect(poster2).toBeInTheDocument();
      expect(poster1).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500/test1.jpg"
      );
      expect(poster2).toHaveAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500/test2.jpg"
      );
    });
  });

  describe("Navigation Actions", () => {
    const initialState = {
      wishlist: { items: [mockMovie1, mockMovie2] },
      movies: {
        popular: { data: [], lastFetched: 0, isLoading: false, error: null },
        topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
        nowPlaying: { data: [], lastFetched: 0, isLoading: false, error: null },
        movieDetails: {},
        detailLoading: {},
        detailError: {},
      },
    };

    it("should navigate to movie detail when clicking poster", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      const poster = screen.getByAltText("Test Movie 1 poster");
      await user.click(poster);

      expect(mockNavigate).toHaveBeenCalledWith("/movie-info/1");
    });
  });

  describe("Remove Actions", () => {
    it("should dispatch removeFromWishlist when clicking remove button", async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<WishlistPage />, {
        preloadedState: {
          wishlist: { items: [mockMovie1, mockMovie2] },
          movies: {
            popular: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            topRated: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            nowPlaying: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            movieDetails: {},
            detailLoading: {},
            detailError: {},
          },
        },
      });

      const removeButtons = screen.getAllByText("💔");
      await user.click(removeButtons[0]);

      // Check that movie was removed from store state
      const state = store.getState();
      expect(state.wishlist.items).toHaveLength(1);
      expect(state.wishlist.items[0].id).toBe(2);
    });

    it("should show confirmation modal when clicking Clear All", async () => {
      const user = userEvent.setup();
      renderWithProviders(<WishlistPage />, {
        preloadedState: {
          wishlist: { items: [mockMovie1, mockMovie2] },
          movies: {
            popular: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            topRated: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            nowPlaying: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            movieDetails: {},
            detailLoading: {},
            detailError: {},
          },
        },
      });

      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      // Check that confirmation modal appears
      expect(screen.getByText("Clear Wishlist")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Are you sure you want to remove all 2 movies from your wishlist/
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Clear All" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" })
      ).toBeInTheDocument();
    });

    it("should dispatch clearWishlist when modal confirmation is accepted", async () => {
      const user = userEvent.setup();

      const { store } = renderWithProviders(<WishlistPage />, {
        preloadedState: {
          wishlist: { items: [mockMovie1, mockMovie2] },
          movies: {
            popular: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            topRated: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            nowPlaying: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            movieDetails: {},
            detailLoading: {},
            detailError: {},
          },
        },
      });

      // Click clear all to open modal
      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      // Click confirm button in modal
      const confirmButton = screen.getByRole("button", { name: "Clear All" });
      await user.click(confirmButton);

      // Check that wishlist was cleared in store state
      await waitFor(() => {
        const state = store.getState();
        expect(state.wishlist.items).toHaveLength(0);
      });
    });

    it("should not dispatch clearWishlist when modal is cancelled", async () => {
      const user = userEvent.setup();

      const { store } = renderWithProviders(<WishlistPage />, {
        preloadedState: {
          wishlist: { items: [mockMovie1, mockMovie2] },
          movies: {
            popular: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            topRated: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            nowPlaying: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            movieDetails: {},
            detailLoading: {},
            detailError: {},
          },
        },
      });

      // Click clear all to open modal
      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      // Click cancel button in modal
      const cancelButton = screen.getByRole("button", { name: "Cancel" });
      await user.click(cancelButton);

      // Check that wishlist items are still there (not cleared)
      await waitFor(() => {
        const state = store.getState();
        expect(state.wishlist.items).toHaveLength(2);
      });

      // Modal should be closed
      expect(screen.queryByText("Clear Wishlist")).not.toBeInTheDocument();
    });

    it("should close modal when clicking backdrop", async () => {
      const user = userEvent.setup();

      renderWithProviders(<WishlistPage />, {
        preloadedState: {
          wishlist: { items: [mockMovie1, mockMovie2] },
          movies: {
            popular: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            topRated: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            nowPlaying: {
              data: [],
              lastFetched: 0,
              isLoading: false,
              error: null,
            },
            movieDetails: {},
            detailLoading: {},
            detailError: {},
          },
        },
      });

      // Click clear all to open modal
      const clearButton = screen.getByText("Clear All");
      await user.click(clearButton);

      // Click backdrop (overlay) to close modal
      const overlay = document.querySelector(".confirmation-modal-overlay");
      if (overlay) {
        await user.click(overlay);
      }

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText("Clear Wishlist")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    const initialState = {
      wishlist: { items: [mockMovie1, mockMovie2] },
      movies: {
        popular: { data: [], lastFetched: 0, isLoading: false, error: null },
        topRated: { data: [], lastFetched: 0, isLoading: false, error: null },
        nowPlaying: { data: [], lastFetched: 0, isLoading: false, error: null },
        movieDetails: {},
        detailLoading: {},
        detailError: {},
      },
    };

    it("should have proper aria labels for remove buttons", () => {
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      expect(
        screen.getByLabelText("Remove Test Movie 1 from wishlist")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Remove Test Movie 2 from wishlist")
      ).toBeInTheDocument();
    });

    it("should have proper aria label for clear all button", () => {
      renderWithProviders(<WishlistPage />, { preloadedState: initialState });

      expect(
        screen.getByLabelText("Clear entire wishlist")
      ).toBeInTheDocument();
    });
  });
});
