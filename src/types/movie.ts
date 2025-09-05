// Movie types from TMDB API
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// API Response types
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Category types
export type MovieCategory = "popular" | "topRated" | "nowPlaying";

export interface CategoryState<T> {
  data: T[];
  lastFetched: number;
  isLoading: boolean;
  error: string | null;
}

export interface DetailState<T> {
  data: T;
  lastFetched: number;
}

export interface WishlistState {
  items: Movie[];
}
