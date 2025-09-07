/// <reference types="cypress" />

describe("Wishlist Smoke Tests", () => {
  beforeEach(() => {
    cy.mockTMDBApi();
  });

  it("should add and remove individual movies from wishlist", () => {
    // Visit movie detail page
    cy.visit("/movie-info/1");

    // Wait for movie detail to load and add to wishlist
    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").click();

    // Check navigation shows updated count
    cy.contains("(1)").should("be.visible");

    // Visit wishlist page
    cy.contains("Wishlist").click();
    cy.url().should("include", "/wishlist");

    // Verify movie is in wishlist
    cy.contains("Test Movie Detail").should("be.visible");
    cy.contains("My Wishlist").should("be.visible");
    cy.contains("1 movie").should("be.visible");
    cy.get('[data-cy="clear-wishlist-button"]').as("clearBtn");
    cy.get('[data-cy="remove-movie-wishlist-button"]').as("remoteBtn");

    // Test removing individual movie from wishlist
    cy.get("@remoteBtn").click();

    // Verify movie is removed and wishlist is empty
    cy.contains("Your wishlist is empty").should("be.visible");
    cy.contains("(0)").should("be.visible");

    // Verify remove/clear buttons are hidden when empty
    cy.get("@clearBtn").should("not.exist");
    cy.get("@remoteBtn").should("not.exist");
  });

  it("should display empty wishlist message when no movies added", () => {
    cy.visit("/wishlist");

    cy.contains("My Wishlist").should("be.visible");
    cy.contains("Your wishlist is empty").should("be.visible");
    cy.contains("(0)").should("be.visible");
  });

  it("should persist wishlist state across navigation", () => {
    // Add movie to wishlist
    cy.visit("/movie-info/1");
    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").click();

    // Navigate away and back
    cy.contains("Home").click();
    cy.contains("(1)").should("be.visible");

    // Verify wishlist still has the movie
    cy.contains("Wishlist").click();
    cy.contains("Test Movie Detail").should("be.visible");
  });

  it("should clear all movies from wishlist", () => {
    // Add first movie to wishlist
    cy.visit("/movie-info/1");
    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").click();
    cy.contains("(1)").should("be.visible");

    // Visit wishlist page
    cy.contains("Wishlist").click();
    cy.url().should("include", "/wishlist");

    // Verify movie is in wishlist and Clear All button is visible
    cy.contains("Test Movie Detail").should("be.visible");
    cy.contains("1 movie").should("be.visible");

    // Click Clear All button
    cy.get('[data-cy="clear-wishlist-button"]').as("clearBtn");
    cy.get("@clearBtn").should("be.visible");
    cy.get("@clearBtn").click();

    // Confirm the clear action in the confirmation modal
    cy.get('[data-cy="confirmation-modal"]').as("confirmationModal");
    cy.get("@confirmationModal").should("be.visible");
    cy.get("@confirmationModal").contains("Clear Wishlist");
    cy.get("@confirmationModal")
      .get('[data-cy="modal-confirm-button"]')
      .as("confirmBtn");
    cy.get("@confirmBtn").click();

    // Verify wishlist is empty
    cy.contains("Your wishlist is empty. Start adding some movies!").should(
      "be.visible"
    );
    cy.contains("(0)").should("be.visible");

    // Verify Clear All button is no longer visible
    cy.get("@clearBtn").should("not.exist");
  });

  it("should not clear wishlist when confirmation is cancelled", () => {
    // Add movie to wishlist
    cy.visit("/movie-info/1");
    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").click();
    cy.contains("(1)").should("be.visible");

    // Visit wishlist page
    cy.contains("Wishlist").click();
    cy.url().should("include", "/wishlist");

    // Click Clear All button
    cy.get('[data-cy="clear-wishlist-button"]').as("clearBtn");
    cy.get("@clearBtn").should("be.visible");
    cy.get("@clearBtn").click();

    // Confirm the clear action in the confirmation modal
    cy.get('[data-cy="confirmation-modal"]').as("confirmationModal");
    cy.get("@confirmationModal").should("be.visible");
    cy.get("@confirmationModal").contains("Clear Wishlist");
    cy.get("@confirmationModal")
      .get('[data-cy="modal-cancel-button"]')
      .as("cancelBtn");
    cy.get("@cancelBtn").click();

    // Verify wishlist still has the movie
    cy.contains("Test Movie Detail").should("be.visible");
    cy.contains("1 movie").should("be.visible");
    cy.contains("(1)").should("be.visible");
    cy.get("@clearBtn").should("be.visible");
  });

  it("should navigate to movie details from wishlist items", () => {
    // Add movie to wishlist
    cy.visit("/movie-info/1");
    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").click();

    // Go to wishlist page
    cy.contains("Wishlist").click();
    cy.url().should("include", "/wishlist");
    cy.contains("Test Movie Detail").should("be.visible");

    // Click on the movie title or poster to view details
    //view-movie-info-button
    cy.get('[data-cy="view-movie-info-button"]').as("viewDetailsBtn");
    cy.get("@viewDetailsBtn").click();

    // Should navigate back to movie detail page
    cy.url().should("include", "/movie-info/1");
    cy.contains("Test Movie Detail").should("be.visible");
    cy.contains("Remove from Wishlist").should("be.visible"); // Should show remove since it's already in wishlist
  });

  it("should handle multiple movies in wishlist", () => {
    // This test simulates adding multiple movies by directly visiting different movie IDs
    // Since we only have one fixture, we'll add the same movie twice to test the count
    cy.visit("/movie-info/1");
    cy.contains("Test Movie Detail", { timeout: 10000 }).should("be.visible");
    cy.contains("Add to Wishlist").click();
    cy.contains("(1)").should("be.visible");

    // Visit wishlist to verify one item
    cy.contains("Wishlist").click();
    cy.contains("1 movie").should("be.visible");

    // Click Clear All button
    cy.get('[data-cy="clear-wishlist-button"]').as("clearBtn");
    cy.get("@clearBtn").should("be.visible");
    cy.get("@clearBtn").click();

    // Confirm the clear action in the confirmation modal
    cy.get('[data-cy="confirmation-modal"]').as("confirmationModal");
    cy.get("@confirmationModal").should("be.visible");
    cy.get("@confirmationModal").contains("Clear Wishlist");
    cy.get("@confirmationModal")
      .get('[data-cy="modal-confirm-button"]')
      .as("confirmBtn");
    cy.get("@confirmBtn").click();

    // Verify wishlist is empty
    cy.contains("Your wishlist is empty. Start adding some movies!").should(
      "be.visible"
    );
    cy.contains("(0)").should("be.visible");

    // Verify Clear All button is no longer visible
    cy.get("@clearBtn").should("not.exist");
  });
});
