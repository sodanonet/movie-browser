// Mock version of tmdbApi for tests
import { Movie, MovieDetail } from "../../types/movie";

// Mock data
export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Test Movie 1",
    overview: "Test overview 1",
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
  },
  {
    id: 2,
    title: "Test Movie 2",
    overview: "Test overview 2",
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
  },
  {
    id: 3,
    title: "Test Movie 3",
    overview: "Test overview 3",
    poster_path: "/test3.jpg",
    backdrop_path: "/test3-backdrop.jpg",
    release_date: "2023-03-01",
    vote_average: 6.8,
    vote_count: 600,
    genre_ids: [16],
    adult: false,
    original_language: "en",
    original_title: "Test Movie 3",
    popularity: 70,
    video: false,
  },
];

export const mockMovieDetail: MovieDetail | any = {
  id: 1,
  title: "Test Movie Detail",
  overview: "Detailed test overview",
  poster_path: "/test-detail.jpg",
  backdrop_path: "/test-detail-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 1500,
  adult: false,
  original_language: "en",
  original_title: "Test Movie Detail",
  popularity: 100,
  video: false,
  runtime: 120,
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
  ],
  budget: 50000000,
  revenue: 150000000,
  production_companies: [
    {
      id: 1,
      name: "Test Studio",
      logo_path: "/test-logo.jpg",
      origin_country: "US",
    },
  ],
  spoken_languages: [
    { english_name: "English", iso_639_1: "en", name: "English" },
  ],
  production_countries: [
    { iso_3166_1: "US", name: "United States of America" },
  ],
  homepage: "https://example.com",
  imdb_id: "tt1234567",
  status: "Released",
  tagline: "Test tagline",
};

// Mock functions
export const fetchMovies = jest.fn().mockResolvedValue(mockMovies);
export const fetchMovieDetail = jest.fn().mockResolvedValue(mockMovieDetail);
