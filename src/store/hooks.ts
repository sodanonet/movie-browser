import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Wishlist selectors
export const useWishlistItems = () =>
  useAppSelector((state) => state.wishlist.items);

export const useWishlistCount = () =>
  useAppSelector((state) => state.wishlist.items.length);

export const useIsInWishlist = (movieId: number) =>
  useAppSelector((state) =>
    state.wishlist.items.some((item) => item.id === movieId)
  );

// Movies selectors
export const usePopularMovies = () =>
  useAppSelector((state) => state.movies.popular);

export const useTopRatedMovies = () =>
  useAppSelector((state) => state.movies.topRated);

export const useNowPlayingMovies = () =>
  useAppSelector((state) => state.movies.nowPlaying);

export const useMovieDetails = (movieId: number) =>
  useAppSelector((state) => state.movies.movieDetails[movieId]);

export const useMovieDetailLoading = (movieId: number) =>
  useAppSelector((state) => state.movies.detailLoading[movieId] || false);

export const useMovieDetailError = (movieId: number) =>
  useAppSelector((state) => state.movies.detailError[movieId] || null);
