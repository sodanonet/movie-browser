/// <reference types="cypress" />

describe("Homepage Smoke Tests", () => {
  beforeEach(() => {
    cy.mockTMDBApi();
    cy.visit("/");
  });

  it("should display the homepage with splash section", () => {
    cy.contains("Discover Amazing Movies").should("be.visible");
    cy.contains(
      "Explore the latest movies, top rated classics, and current cinema releases"
    ).should("be.visible");
  });

  it("should display all three movie categories", () => {
    cy.contains("Popular Movies").should("be.visible");
    cy.contains("Top Rated").should("be.visible");
    cy.contains("Now Playing").should("be.visible");
  });

  it("should load movie data from API", () => {
    // Check that movie cards eventually appear (indicates API mocking worked)
    cy.contains("Test Popular Movie 1", { timeout: 10000 }).should(
      "be.visible"
    );
    cy.contains("Test Popular Movie 2", { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("should have working navigation", () => {
    cy.get("nav").should("be.visible");
    cy.contains("Movie Browser").should("be.visible");
    cy.contains("Home").should("be.visible");
    cy.contains("Wishlist").should("be.visible");
    cy.contains("(0)").should("be.visible");
  });
});
