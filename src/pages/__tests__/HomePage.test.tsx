import { describe, it, expect } from "@jest/globals";
import { screen, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../../test/utils/test-utils";
import HomePage from "../HomePage";

describe("HomePage Component", () => {
  it("renders hero section correctly", async () => {
    await act(async () => {
      renderWithProviders(<HomePage />);
    });

    expect(screen.getByText("Discover Amazing Movies")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Explore the latest movies, top rated classics, and current cinema releases"
      )
    ).toBeInTheDocument();
  });

  it("renders all three carousel sections", async () => {
    await act(async () => {
      renderWithProviders(<HomePage />);
    });

    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    expect(screen.getByText("Top Rated")).toBeInTheDocument();
    expect(screen.getByText("Now Playing")).toBeInTheDocument();
  });

  it("shows loading states initially", async () => {
    // Mock loading state with recent lastFetched to prevent cache invalidation
    const recentTime = Date.now();
    const preloadedState = {
      movies: {
        popular: {
          data: [],
          lastFetched: recentTime,
          isLoading: true,
          error: null,
        },
        topRated: {
          data: [],
          lastFetched: recentTime,
          isLoading: true,
          error: null,
        },
        nowPlaying: {
          data: [],
          lastFetched: recentTime,
          isLoading: true,
          error: null,
        },
        movieDetails: {},
        detailLoading: {},
        detailError: {},
      },
    };

    await act(async () => {
      renderWithProviders(<HomePage />, { preloadedState });
    });

    // Check for carousel titles even in loading state
    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    expect(screen.getByText("Top Rated")).toBeInTheDocument();
    expect(screen.getByText("Now Playing")).toBeInTheDocument();

    // Check for loading skeleton elements
    expect(
      document.querySelectorAll(".carousel__loading-skeleton")
    ).toHaveLength(3);
  });

  it("displays movie counts after data loads", async () => {
    const mockMovies = [
      {
        id: 1,
        title: "Movie 1",
        overview: "Overview 1",
        poster_path: "/poster1.jpg",
        backdrop_path: "/backdrop1.jpg",
        release_date: "2023-01-01",
        vote_average: 8.0,
        vote_count: 100,
        genre_ids: [28],
        adult: false,
        original_language: "en",
        original_title: "Movie 1",
        popularity: 100,
        video: false,
      },
      {
        id: 2,
        title: "Movie 2",
        overview: "Overview 2",
        poster_path: "/poster2.jpg",
        backdrop_path: "/backdrop2.jpg",
        release_date: "2023-02-01",
        vote_average: 7.5,
        vote_count: 200,
        genre_ids: [18],
        adult: false,
        original_language: "en",
        original_title: "Movie 2",
        popularity: 90,
        video: false,
      },
      {
        id: 3,
        title: "Movie 3",
        overview: "Overview 3",
        poster_path: "/poster3.jpg",
        backdrop_path: "/backdrop3.jpg",
        release_date: "2023-03-01",
        vote_average: 9.0,
        vote_count: 300,
        genre_ids: [16],
        adult: false,
        original_language: "en",
        original_title: "Movie 3",
        popularity: 110,
        video: false,
      },
    ];

    const preloadedState = {
      movies: {
        popular: {
          data: mockMovies,
          lastFetched: Date.now(),
          isLoading: false,
          error: null,
        },
        topRated: {
          data: mockMovies,
          lastFetched: Date.now(),
          isLoading: false,
          error: null,
        },
        nowPlaying: {
          data: mockMovies,
          lastFetched: Date.now(),
          isLoading: false,
          error: null,
        },
        movieDetails: {},
        detailLoading: {},
        detailError: {},
      },
    };

    await act(async () => {
      renderWithProviders(<HomePage />, { preloadedState });
    });

    await waitFor(
      () => {
        expect(screen.getAllByText("Movie 1")).toHaveLength(3); // appears in all 3 carousels
        expect(screen.getAllByText("Movie 2")).toHaveLength(3); // appears in all 3 carousels
        expect(screen.getAllByText("Movie 3")).toHaveLength(3); // appears in all 3 carousels
        expect(screen.getByText("Popular Movies")).toBeInTheDocument();
        expect(screen.getByText("Top Rated")).toBeInTheDocument();
        expect(screen.getByText("Now Playing")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
