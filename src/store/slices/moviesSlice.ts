import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Movie, MovieDetail } from "../../types/movie";
import { fetchMovies, fetchMovieDetail } from "../../services/tmdbApi";

interface CategoryData {
  data: Movie[];
  lastFetched: number;
  isLoading: boolean;
  error: string | null;
}

interface MoviesState {
  popular: CategoryData;
  topRated: CategoryData;
  nowPlaying: CategoryData;
  movieDetails: Record<number, { data: MovieDetail; lastFetched: number }>;
  detailLoading: Record<number, boolean>;
  detailError: Record<number, string | null>;
}

const initialCategoryState: CategoryData = {
  data: [],
  lastFetched: 0,
  isLoading: false,
  error: null,
};

const initialState: MoviesState = {
  popular: initialCategoryState,
  topRated: initialCategoryState,
  nowPlaying: initialCategoryState,
  movieDetails: {},
  detailLoading: {},
  detailError: {},
};

// Async thunks
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopular",
  async () => {
    const response = await fetchMovies("popular");
    return response;
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  "movies/fetchTopRated",
  async () => {
    const response = await fetchMovies("top_rated");
    return response;
  }
);

export const fetchNowPlayingMovies = createAsyncThunk(
  "movies/fetchNowPlaying",
  async () => {
    const response = await fetchMovies("now_playing");
    return response;
  }
);

export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchDetail",
  async (movieId: number) => {
    const response = await fetchMovieDetail(movieId);
    return { movieId, data: response };
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Popular movies
    builder
      .addCase(fetchPopularMovies.pending, (state) => {
        state.popular.isLoading = true;
        state.popular.error = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popular.data = action.payload;
        state.popular.isLoading = false;
        state.popular.lastFetched = Date.now();
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.popular.isLoading = false;
        state.popular.error =
          action.error.message || "Failed to fetch popular movies";
      });

    // Top rated movies
    builder
      .addCase(fetchTopRatedMovies.pending, (state) => {
        state.topRated.isLoading = true;
        state.topRated.error = null;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.topRated.data = action.payload;
        state.topRated.isLoading = false;
        state.topRated.lastFetched = Date.now();
      })
      .addCase(fetchTopRatedMovies.rejected, (state, action) => {
        state.topRated.isLoading = false;
        state.topRated.error =
          action.error.message || "Failed to fetch top rated movies";
      });

    // Now playing movies
    builder
      .addCase(fetchNowPlayingMovies.pending, (state) => {
        state.nowPlaying.isLoading = true;
        state.nowPlaying.error = null;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.nowPlaying.data = action.payload;
        state.nowPlaying.isLoading = false;
        state.nowPlaying.lastFetched = Date.now();
      })
      .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
        state.nowPlaying.isLoading = false;
        state.nowPlaying.error =
          action.error.message || "Failed to fetch now playing movies";
      });

    // Movie details
    builder
      .addCase(fetchMovieDetails.pending, (state, action) => {
        state.detailLoading[action.meta.arg] = true;
        state.detailError[action.meta.arg] = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        const { movieId, data } = action.payload;
        state.movieDetails[movieId] = { data, lastFetched: Date.now() };
        state.detailLoading[movieId] = false;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.detailLoading[action.meta.arg] = false;
        state.detailError[action.meta.arg] =
          action.error.message || "Failed to fetch movie details";
      });
  },
});

export default moviesSlice.reducer;
