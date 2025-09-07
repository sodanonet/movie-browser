import { useRef, useState, useEffect } from "react";
import { Movie, MovieCategory } from "../../types/movie";
import MovieCard from "../movie/MovieCard";
import { CATEGORY_NAMES } from "../../utils/constants";

interface CarouselProps {
  movies?: Movie[];
  category: MovieCategory;
  isLoading: boolean;
  error: string | null;
  title?: string;
}

const Carousel = ({
  movies = [],
  category,
  isLoading,
  error,
  title,
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayTitle = title || CATEGORY_NAMES[category];

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    // Responsive scroll amount based on screen size
    let scrollAmount = 320 * 3; // Desktop: Width of 3 cards

    if (window.innerWidth <= 640) {
      // Small mobile devices
      scrollAmount = 300; // Show one item at a time
    } else if (window.innerWidth <= 768) {
      // Tablet
      scrollAmount = 320 * 2; // Show 2 cards
    }

    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (error) {
    return (
      <section className={`carousel carousel--${category}`}>
        <div className="carousel__header">
          <h2 className="carousel__title">{displayTitle}</h2>
        </div>
        <div className="carousel__error">
          <p>
            Error loading {displayTitle.toLowerCase()}: {error}
          </p>
          <button
            className="carousel__retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={`carousel carousel--${category}`}>
      <div className="carousel__header">
        <h2 className="carousel__title">{displayTitle}</h2>
        {movies.length > 0 && (
          <div className="carousel__controls">
            <button
              className={`carousel__button carousel__button--prev ${
                !canScrollLeft ? "carousel__button--disabled" : ""
              }`}
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              className={`carousel__button carousel__button--next ${
                !canScrollRight ? "carousel__button--disabled" : ""
              }`}
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="carousel__loading">
          <div className="carousel__loading-skeleton">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="carousel__loading-card">
                <div className="carousel__loading-image"></div>
                <div className="carousel__loading-content">
                  <div className="carousel__loading-title"></div>
                  <div className="carousel__loading-text"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : movies.length === 0 ? (
        <div className="carousel__empty">
          <p>No movies found for {displayTitle.toLowerCase()}</p>
        </div>
      ) : (
        <div className="carousel__wrapper">
          {/* Side navigation buttons for desktop/tablet - outside scrolling container */}
          {movies.length > 0 && (
            <>
              <button
                className={`carousel__nav--prev ${
                  !canScrollLeft ? "carousel__nav--disabled" : ""
                }`}
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                ←
              </button>
              <button
                className={`carousel__nav--next ${
                  !canScrollRight ? "carousel__nav--disabled" : ""
                }`}
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                →
              </button>
            </>
          )}

          <div
            className="carousel__container"
            ref={scrollRef}
            onScroll={updateScrollButtons}
          >
            <div className="carousel__track">
              {movies.map((movie, index) => (
                <div key={movie.id} className="carousel__item">
                  <MovieCard
                    movie={movie}
                    category={category}
                    // Don't lazy load first 4 items (above fold)
                    lazy={index > 3}
                    // High priority for first 2 items
                    priority={index < 2}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Carousel;
