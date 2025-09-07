/// <reference types="cypress" />

describe("Navigation Smoke Tests", () => {
  beforeEach(() => {
    cy.mockTMDBApi();
  });

  it("should navigate between pages correctly", () => {
    cy.visit("/");

    // Test navigation to wishlist
    cy.contains("Wishlist").click();
    cy.url().should("include", "/wishlist");
    cy.contains("My Wishlist").should("be.visible");
    cy.contains("Your wishlist is empty").should("be.visible");

    // Test navigation back to home
    cy.contains("Home").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.contains("Discover Amazing Movies").should("be.visible");
  });

  it("should navigate to movie detail page", () => {
    cy.visit("/movie-info/1");

    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").should("be.visible");
  });

  it("should handle invalid movie ID gracefully", () => {
    cy.visit("/movie-info/invalid");
    cy.contains("Invalid movie ID").should("be.visible");
  });
});
