import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/utils/test-utils";
import Navigation from "../Navigation";

describe("Navigation Component", () => {
  it("renders navigation links correctly", () => {
    renderWithProviders(<Navigation />);

    expect(screen.getByText("Movie Browser")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("(0)")).toBeInTheDocument();
  });

  it("displays correct wishlist count when items are added", () => {
    const preloadedState = {
      wishlist: {
        items: [
          {
            id: 1,
            title: "Test Movie",
            overview: "Test overview",
            poster_path: "/test.jpg",
            backdrop_path: "/test-backdrop.jpg",
            release_date: "2023-01-01",
            vote_average: 8.0,
            vote_count: 100,
            genre_ids: [28],
            adult: false,
            original_language: "en",
            original_title: "Test Movie",
            popularity: 100,
            video: false,
          },
        ],
      },
    };

    renderWithProviders(<Navigation />, { preloadedState });

    expect(screen.getByText("Wishlist")).toBeInTheDocument();
    expect(screen.getByText("(1)")).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    renderWithProviders(<Navigation />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const wishlistLink = screen.getByRole("link", {
      name: /0 items in wishlist/i,
    });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(wishlistLink).toHaveAttribute("href", "/wishlist");
  });
});
