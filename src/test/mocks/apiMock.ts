import MockAdapter from "axios-mock-adapter";
import { api } from "../../services/tmdbApi";
import { mockMovies, mockMovieDetail } from "./movieData";

export const mockApi = new MockAdapter(api, { delayResponse: 100 });

export const setupApiMocks = () => {
  // Mock Movie list endpoints
  mockApi.onGet(/\/movie\/(popular|top_rated|now_playing)/).reply(200, {
    page: 1,
    results: mockMovies,
    total_pages: 10,
    total_results: 200,
  });

  // Mock Movie detail endpoint
  mockApi.onGet(/\/movie\/\d+/).reply(200, mockMovieDetail);

  // Mock search endpoint
  mockApi.onGet("/search/movie").reply(200, {
    page: 1,
    results: mockMovies,
    total_pages: 1,
    total_results: mockMovies.length,
  });
};

export const teardownApiMocks = () => {
  mockApi.reset();
};

// For testing error scenarios
export const setupApiErrorMocks = () => {
  mockApi.onGet(/\/movie\//).reply(500, {
    status_message: "Internal server error",
    status_code: 500,
  });
};
