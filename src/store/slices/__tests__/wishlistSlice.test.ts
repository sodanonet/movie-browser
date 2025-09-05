import { describe, it, expect, beforeEach } from "@jest/globals";
import wishlistReducer, {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../wishlistSlice";
import { Movie } from "../../../types/movie";

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.0,
  vote_count: 100,
  adult: false,
  original_language: "en",
  original_title: "Test Movie",
  popularity: 100,
  video: false,
  genre_ids: [28],
};

describe("wishlistSlice", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should add movie to wishlist", () => {
    const initialState = { items: [] };
    const action = addToWishlist(mockMovie);
    const newState = wishlistReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual(mockMovie);
  });

  it("should not add duplicate movies", () => {
    const initialState = { items: [mockMovie] };
    const action = addToWishlist(mockMovie);
    const newState = wishlistReducer(initialState, action);

    expect(newState.items).toHaveLength(1);
  });

  it("should remove movie from wishlist", () => {
    const initialState = { items: [mockMovie] };
    const action = removeFromWishlist(mockMovie.id);
    const newState = wishlistReducer(initialState, action);

    expect(newState.items).toHaveLength(0);
  });

  it("should clear all items from wishlist", () => {
    const initialState = { items: [mockMovie] };
    const action = clearWishlist();
    const newState = wishlistReducer(initialState, action);

    expect(newState.items).toHaveLength(0);
  });
});
