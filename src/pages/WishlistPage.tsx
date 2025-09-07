import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  removeFromWishlist,
  clearWishlist,
} from "../store/slices/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmationModal from "../components/ui/ConfirmationModal";

const WishlistPage = () => {
  const { items } = useSelector((state: RootState) => state.wishlist);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleRemoveFromWishlist = (movieId: number) => {
    dispatch(removeFromWishlist(movieId));
  };

  const handleClearWishlist = () => {
    setShowClearModal(true);
  };

  const confirmClearWishlist = () => {
    dispatch(clearWishlist());
    setShowClearModal(false);
  };

  const cancelClearWishlist = () => {
    setShowClearModal(false);
  };

  const handleViewMovie = (movieId: number) => {
    navigate(`/movie-info/${movieId}`);
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return "/placeholder-poster.jpg";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div className="wishlist">
      <div className="wishlist__header">
        <h1>My Wishlist</h1>
        {items.length > 0 && (
          <div className="wishlist__actions">
            <span className="wishlist__count">
              {items.length} {items.length === 1 ? "movie" : "movies"}
            </span>
            <button
              className="wishlist__clear-btn"
              data-cy="clear-wishlist-button"
              onClick={handleClearWishlist}
              aria-label="Clear entire wishlist"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="wishlist__empty">
          <p>Your wishlist is empty. Start adding some movies!</p>
          <button
            className="browse-movies-btn"
            data-cy="browse-movies-btn"
            onClick={() => navigate("/")}
          >
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="wishlist__grid">
          {items.map((movie) => (
            <div key={movie.id} className="wishlist__item">
              <div className="wishlist__item__poster">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={`${movie.title} poster`}
                  className="wishlist__item__image"
                  data-cy="view-movie-info-button"
                  onClick={() => handleViewMovie(movie.id)}
                />
              </div>
              <div className="wishlist__item__content">
                <div className="wishlist__item__title-row">
                  <h3 className="wishlist__item__title">{movie.title}</h3>
                  <button
                    className="wishlist__item__remove-btn"
                    onClick={() => handleRemoveFromWishlist(movie.id)}
                    data-cy="remove-movie-wishlist-button"
                    aria-label={`Remove ${movie.title} from wishlist`}
                  >
                    💔
                  </button>
                </div>
                <p className="wishlist__item__overview">
                  {movie.overview.length > 120
                    ? `${movie.overview.substring(0, 120)}...`
                    : movie.overview}
                </p>
                <div className="wishlist__item__meta">
                  <span className="wishlist__item__rating">
                    ⭐ {movie.vote_average.toFixed(1)}/10
                  </span>
                  <span className="wishlist__item__year">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear Wishlist"
        message={`Are you sure you want to remove all ${items.length} ${
          items.length === 1 ? "movie" : "movies"
        } from your wishlist? This action cannot be undone.`}
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={confirmClearWishlist}
        onCancel={cancelClearWishlist}
        type="danger"
      />
    </div>
  );
};

export default WishlistPage;
