import { Link } from "react-router-dom";
import { useState } from "react";
import { Movie, MovieCategory } from "../../types/movie";
import { getImageUrl, formatRating } from "../../services/tmdbApi";
import { getCategoryTheme } from "../../utils/helpers";
import { useIsInWishlist } from "../../store/hooks";
import { useLazyLoading } from "../../hooks/useLazyLoading";

interface MovieCardProps {
  movie: Movie;
  category: MovieCategory;
  lazy?: boolean;
  priority?: boolean; // For above-the-fold images
}

const MovieCard = ({
  movie,
  category,
  lazy = true,
  priority = false,
}: MovieCardProps) => {
  const isInWishlist = useIsInWishlist(movie.id);
  const themeClass = getCategoryTheme(category);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use intersection observer for advanced lazy loading
  const { isVisible, ref } = useLazyLoading({
    threshold: 0.1,
    rootMargin: "100px", // Start loading 100px before entering viewport
    triggerOnce: true,
  });

  const imageUrl = getImageUrl(movie.poster_path, "w300");
  const shouldLoadImage = !lazy || isVisible || priority;

  // Preload high-priority images (currently unused but available for future enhancement)
  // const { loading: imagePreloading, error: imageError } = useImagePreload(
  //   priority && imageUrl ? imageUrl : ''
  // )

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder-movie.jpg";
  };

  return (
    <Link
      ref={ref as never}
      to={`/movie-info/${movie.id}`}
      className={`movie-card ${themeClass} ${
        !imageLoaded && shouldLoadImage ? "movie-card--loading" : ""
      }`}
      data-cy="movie-card"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-card__image-container">
        {shouldLoadImage ? (
          <img
            src={imageUrl}
            alt={movie.title}
            className={`movie-card__image ${
              imageLoaded ? "movie-card__image--loaded" : ""
            }`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div
            className="movie-card__image-placeholder"
            style={{
              aspectRatio: "2/3",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#666", fontSize: "14px" }}>Loading...</span>
          </div>
        )}

        {isInWishlist && (
          <div
            className="movie-card__wishlist-indicator"
            aria-label="In wishlist"
          >
            <span className="movie-card__heart">❤️</span>
          </div>
        )}

        <div className="movie-card__rating">
          <span className="movie-card__rating-value">
            {formatRating(movie.vote_average)}
          </span>
          <span className="movie-card__rating-icon">⭐</span>
        </div>
      </div>

      <div className="movie-card__content">
        <h3 className="movie-card__title">{movie.title}</h3>
        <p className="movie-card__year">
          {new Date(movie.release_date).getFullYear()}
        </p>
        <p className="movie-card__overview">
          {movie.overview.length > 100
            ? `${movie.overview.substring(0, 100)}...`
            : movie.overview}
        </p>
      </div>

      <div className="movie-card__overlay">
        <div className="movie-card__overlay-content">
          <span className="movie-card__cta">View Details</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
