import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { store } from "../store";

// Simple SSR component that renders basic structure
function SSRApp({ url }: { url: string }) {
  let title = "Movie Browser";
  let description =
    "Discover amazing movies - Popular movies, top-rated movies, and now playing releases";

  // Simple route-based content without React Router
  let content = <div>Loading...</div>;

  if (url === "/") {
    title = "Movie Browser - Discover Amazing Movies";
    description =
      "Browse popular movies, top-rated classics, and now playing movies. Create your personal wishlist and explore cinema.";
    content = (
      <div>
        <h1>Movie Browser</h1>
        <p>
          Discover amazing movies - Popular movies, top-rated movies, and now
          playing releases
        </p>
      </div>
    );
  } else if (url.startsWith("/movie-info/")) {
    const movieId = url.match(/\/movie-info\/(\d+)/)?.[1];
    title = `Movie Details - Movie Browser`;
    description = `View detailed information about movie ${movieId} including ratings, cast, and reviews.`;
    content = (
      <div>
        <h1>Movie Detail</h1>
        <p>Loading movie {movieId}...</p>
      </div>
    );
  } else if (url === "/wishlist") {
    title = "My Wishlist - Movie Browser";
    description =
      "View and manage your personal movie wishlist. Keep track of movies you want to watch.";
    content = (
      <div>
        <h1>My Wishlist</h1>
        <p>Your saved movies</p>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </head>
      <div className="app">
        <nav className="navigation">
          <div className="nav-brand">🎬 Movie Browser</div>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/wishlist">Wishlist</a>
          </div>
        </nav>
        <main className="main-content">{content}</main>
      </div>
    </>
  );
}

export function render(url: string) {
  const html = renderToString(
    <React.StrictMode>
      <Provider store={store}>
        <SSRApp url={url} />
      </Provider>
    </React.StrictMode>
  );

  return { html };
}
