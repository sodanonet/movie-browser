import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchMovieDetails } from "../store/slices/moviesSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { MovieCategory } from "../types/movie";

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const movieId = id ? parseInt(id, 10) : null;

  const {
    movieDetails,
    detailLoading,
    detailError,
    popular,
    topRated,
    nowPlaying,
  } = useSelector((state: RootState) => state.movies);
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const movie = movieId ? movieDetails[movieId] : null;
  const isLoading = movieId ? detailLoading[movieId] : false;
  const error = movieId ? detailError[movieId] : null;
  const isInWishlist = movieId
    ? wishlistItems?.some((item) => item.id === movieId) || false
    : false;

  const [movieCategory, setMovieCategory] = useState<MovieCategory>("popular");

  useEffect(() => {
    if (movieId && !movie) {
      dispatch(fetchMovieDetails(movieId));
    }

    // Determine which category this movie belongs to
    if (movieId) {
      if (popular.data.some((f) => f.id === movieId)) {
        setMovieCategory("popular");
      } else if (topRated.data.some((f) => f.id === movieId)) {
        setMovieCategory("top_rated");
      } else if (nowPlaying.data.some((f) => f.id === movieId)) {
        setMovieCategory("now_playing");
      }
    }
  }, [dispatch, movieId, movie, popular.data, topRated.data, nowPlaying.data]);

  if (!movieId) {
    return <div className="error">Invalid movie ID</div>;
  }

  if (isLoading) {
    return <div className="loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!movie) {
    return <div className="loading">Loading...</div>;
  }

  const handleWishlistToggle = () => {
    if (!movie) return;

    const movieData = {
      id: movie.data.id,
      title: movie.data.title,
      poster_path: movie.data.poster_path,
      backdrop_path: movie.data.backdrop_path,
      vote_average: movie.data.vote_average,
      vote_count: movie.data.vote_count,
      release_date: movie.data.release_date,
      overview: movie.data.overview,
      genre_ids: movie.data.genres.map((g) => g.id),
      adult: movie.data.adult,
      original_language: movie.data.original_language,
      original_title: movie.data.original_title,
      popularity: movie.data.popularity,
      video: movie.data.video,
    };

    if (isInWishlist) {
      dispatch(removeFromWishlist(movie.data.id));
    } else {
      dispatch(addToWishlist(movieData));
    }
  };

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = (
    path: string | null,
    size: "w500" | "w1280" = "w500"
  ) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  return (
    <div
      className={`movie-detail movie-detail--${movieCategory.replace(
        "_",
        "-"
      )}`}
    >
      {movie.data.backdrop_path && (
        <div className="movie-detail__backdrop">
          <img
            src={getImageUrl(movie.data.backdrop_path, "w1280")}
            alt={movie.data.title}
            className="movie-detail__backdrop-image"
          />
          <div className="movie-detail__backdrop-overlay" />
        </div>
      )}

      <div className="movie-detail__container">
        <button
          className="movie-detail__back-button"
          onClick={() => navigate("/")}
          aria-label="Go back to homepage"
        >
          ← Back to Movies
        </button>

        <div className="movie-detail__content">
          <div className="movie-detail__poster-section">
            <img
              src={getImageUrl(movie.data.poster_path)}
              alt={`${movie.data.title} poster`}
              className="movie-detail__poster"
            />
          </div>

          <div className="movie-detail__info">
            <div className="movie-detail__header">
              <h1 className="movie-detail__title">{movie.data.title}</h1>
              {movie.data.tagline && (
                <p className="movie-detail__tagline">{movie.data.tagline}</p>
              )}
            </div>

            <div className="movie-detail__meta">
              <div className="movie-detail__rating">
                <span className="movie-detail__rating-score">
                  {movie.data.vote_average.toFixed(1)}
                </span>
                <span className="movie-detail__rating-text">/10</span>
                <span className="movie-detail__vote-count">
                  ({movie.data.vote_count.toLocaleString()} votes)
                </span>
              </div>

              <div className="movie-detail__details">
                <span className="movie-detail__release-date">
                  {new Date(movie.data.release_date).getFullYear()}
                </span>
                {movie.data.runtime && (
                  <>
                    <span className="movie-detail__separator">•</span>
                    <span className="movie-detail__runtime">
                      {formatRuntime(movie.data.runtime)}
                    </span>
                  </>
                )}
                {movie.data.genres.length > 0 && (
                  <>
                    <span className="movie-detail__separator">•</span>
                    <span className="movie-detail__genres">
                      {movie.data.genres.map((genre) => genre.name).join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              className={`movie-detail__wishlist-button ${
                isInWishlist ? "movie-detail__wishlist-button--active" : ""
              }`}
              onClick={handleWishlistToggle}
              aria-label={
                isInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {isInWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
            </button>

            {movie.data.overview && (
              <div className="movie-detail__overview">
                <h2 className="movie-detail__section-title">Overview</h2>
                <p className="movie-detail__overview-text">
                  {movie.data.overview}
                </p>
              </div>
            )}

            <div className="movie-detail__additional-info">
              {movie.data.budget > 0 && (
                <div className="movie-detail__info-item">
                  <strong>Budget:</strong> {formatCurrency(movie.data.budget)}
                </div>
              )}

              {movie.data.revenue > 0 && (
                <div className="movie-detail__info-item">
                  <strong>Revenue:</strong> {formatCurrency(movie.data.revenue)}
                </div>
              )}

              {movie.data.production_companies.length > 0 && (
                <div className="movie-detail__info-item">
                  <strong>Production:</strong>{" "}
                  {movie.data.production_companies
                    .map((company) => company.name)
                    .join(", ")}
                </div>
              )}

              {movie.data.spoken_languages.length > 0 && (
                <div className="movie-detail__info-item">
                  <strong>Languages:</strong>{" "}
                  {movie.data.spoken_languages
                    .map((lang) => lang.english_name)
                    .join(", ")}
                </div>
              )}

              <div className="movie-detail__info-item">
                <strong>Status:</strong> {movie.data.status}
              </div>

              {movie.data.homepage && (
                <div className="movie-detail__info-item">
                  <a
                    href={movie.data.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="movie-detail__homepage-link"
                  >
                    Official Website →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
