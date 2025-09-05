import { Movie, MovieDetail } from "../../types/movie";

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Test Movie 1",
    overview: "This is a test movie overview",
    poster_path: "/test1.jpg",
    backdrop_path: "/test1-backdrop.jpg",
    release_date: "2023-01-01",
    vote_average: 8.0,
    vote_count: 100,
    adult: false,
    original_language: "en",
    original_title: "Test Movie 1",
    popularity: 100,
    video: false,
    genre_ids: [28, 12],
  },
  {
    id: 2,
    title: "Test Movie 2",
    overview: "This is another test movie",
    poster_path: "/test2.jpg",
    backdrop_path: "/test2-backdrop.jpg",
    release_date: "2023-02-01",
    vote_average: 7.5,
    vote_count: 80,
    adult: false,
    original_language: "en",
    original_title: "Test Movie 2",
    popularity: 90,
    video: false,
    genre_ids: [18, 35],
  },
];

export const mockMovieDetail: MovieDetail = {
  ...mockMovies[0],
  runtime: 120,
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
  ],
  production_companies: [],
  production_countries: [],
  spoken_languages: [],
  budget: 50000000,
  revenue: 200000000,
  status: "Released",
  tagline: "Test tagline",
  homepage: "https://test.com",
  imdb_id: "tt1234567",
};
