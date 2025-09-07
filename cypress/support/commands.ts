export {}; // Ensure this file is treated as a module

/// <reference types="cypress" />

Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-cy="${value}"]`);
});

// Custom command to mock TMDB API
Cypress.Commands.add("mockTMDBApi", () => {
  // Use more generic patterns to catch all TMDB API requests
  cy.intercept("GET", "**/movie/popular*", {
    fixture: "popular-films.json",
  }).as("getPopularFilms");

  cy.intercept("GET", "**/movie/top_rated*", {
    fixture: "top-rated-films.json",
  }).as("getTopRatedFilms");

  cy.intercept("GET", "**/movie/now_playing*", {
    fixture: "now-playing-films.json",
  }).as("getNowPlayingFilms");

  // More specific pattern for film details (avoid catching the category endpoints)
  cy.intercept("GET", "**/movie/[0-9]*", {
    fixture: "film-detail.json",
  }).as("getFilmDetail");
});

declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      mockTMDBApi(): Chainable;
    }
  }
}
