import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./slices/moviesSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
