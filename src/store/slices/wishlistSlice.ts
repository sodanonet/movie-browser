import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../types/movie";

interface WishlistState {
  items: Movie[];
}

const initialState: WishlistState = {
  items: [],
};

// Load wishlist from localStorage on init
const loadWishlistFromStorage = (): Movie[] => {
  try {
    const stored = localStorage.getItem("film-browser-wishlist");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading wishlist from localStorage:", error);
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (items: Movie[]) => {
  try {
    localStorage.setItem("film-browser-wishlist", JSON.stringify(items));
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error);
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    ...initialState,
    items: loadWishlistFromStorage(),
  },
  reducers: {
    addToWishlist: (state, action: PayloadAction<Movie>) => {
      const film = action.payload;
      const isAlreadyInWishlist = state.items.some(
        (item) => item.id === film.id
      );

      if (!isAlreadyInWishlist) {
        state.items.push(film);
        saveWishlistToStorage(state.items);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<number>) => {
      const filmId = action.payload;
      state.items = state.items.filter((item) => item.id !== filmId);
      saveWishlistToStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },

    loadWishlist: (state) => {
      state.items = loadWishlistFromStorage();
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  loadWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
