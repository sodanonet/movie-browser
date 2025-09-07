import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import wishlistReducer from "../../store/slices/wishlistSlice";
import moviesReducer from "../../store/slices/moviesSlice";
import { RootState } from "../../store";

// Create a test store factory
export function createTestStore(
  preloadedState?: Partial<RootState>
): ReturnType<typeof configureStore<RootState>> {
  const defaultCategoryState = {
    data: [],
    lastFetched: 0,
    isLoading: false,
    error: null,
  };

  const defaultState: Partial<RootState> = {
    wishlist: {
      items: [],
      ...preloadedState?.wishlist,
    },
    movies: {
      popular: defaultCategoryState,
      topRated: defaultCategoryState,
      nowPlaying: defaultCategoryState,
      movieDetails: {},
      detailLoading: {},
      detailError: {},
      ...preloadedState?.movies,
    },
  };

  return configureStore({
    reducer: {
      wishlist: wishlistReducer as any,
      movies: moviesReducer as any,
    },
    preloadedState: defaultState,
  }) as any;
}

// Custom render function that includes providers
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Special render function for App component (which already includes Router)
export function renderAppWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // App already includes Provider and Router, so just render directly
  return { store, ...render(ui, renderOptions) };
}

// Re-export everything
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
