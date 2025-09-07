import { useEffect } from "react";
import {
  useAppDispatch,
  usePopularMovies,
  useTopRatedMovies,
  useNowPlayingMovies,
} from "../store/hooks";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
} from "../store/slices/moviesSlice";
import Carousel from "../components/carousel/Carousel";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { isCacheValid } from "../utils/helpers";
import { CACHE_DURATION } from "../utils/constants";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const popularMovies = usePopularMovies();
  const topRatedMovies = useTopRatedMovies();
  const nowPlayingMovies = useNowPlayingMovies();

  useEffect(() => {
    // Fetch data only if cache is stale
    if (!isCacheValid(popularMovies.lastFetched, CACHE_DURATION.MOVIES)) {
      dispatch(fetchPopularMovies());
    }
    if (!isCacheValid(topRatedMovies.lastFetched, CACHE_DURATION.MOVIES)) {
      dispatch(fetchTopRatedMovies());
    }
    if (!isCacheValid(nowPlayingMovies.lastFetched, CACHE_DURATION.MOVIES)) {
      dispatch(fetchNowPlayingMovies());
    }
  }, [
    dispatch,
    popularMovies.lastFetched,
    topRatedMovies.lastFetched,
    nowPlayingMovies.lastFetched,
  ]);

  return (
    <div className="homepage">
      <section className="splash">
        <div className="splash__content">
          <h1 className="splash__title">Discover Amazing Movies</h1>
          <p className="splash__subtitle">
            Explore the latest movies, top rated classics, and current cinema
            releases
          </p>
        </div>
        <div className="splash__background"></div>
      </section>

      <section className="carousels">
        <ErrorBoundary>
          <Carousel
            movies={popularMovies.data}
            category="popular"
            isLoading={popularMovies.isLoading}
            error={popularMovies.error}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <Carousel
            movies={topRatedMovies.data}
            category="top_rated"
            isLoading={topRatedMovies.isLoading}
            error={topRatedMovies.error}
          />
        </ErrorBoundary>

        <ErrorBoundary>
          <Carousel
            movies={nowPlayingMovies.data}
            category="now_playing"
            isLoading={nowPlayingMovies.isLoading}
            error={nowPlayingMovies.error}
          />
        </ErrorBoundary>
      </section>
    </div>
  );
};

export default HomePage;
