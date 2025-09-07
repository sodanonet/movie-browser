import { Link, useLocation } from "react-router-dom";
import { useWishlistCount } from "../store/hooks";

const Navigation = () => {
  const wishlistCount = useWishlistCount();
  const location = useLocation();

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        <Link to="/" className="logo" aria-label="Movie Browser - Home">
          <span className="logo__text">🎬 Movie Browser</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "nav-link--active" : ""}`}
            aria-current={isActive("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            to="/wishlist"
            className={`nav-link ${
              isActive("/wishlist") ? "nav-link--active" : ""
            }`}
            aria-current={isActive("/wishlist") ? "page" : undefined}
          >
            <span className="nav-link__text">Wishlist</span>
            <span
              className="nav-link__count"
              aria-label={`${wishlistCount} items in wishlist`}
            >
              ({wishlistCount})
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
