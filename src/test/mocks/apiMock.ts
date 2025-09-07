import MockAdapter from "axios-mock-adapter";
import { mockMovies, mockMovieDetail } from "./movieData";
import { api } from "../../services/tmdbApi";

export const setupApiMocking = () => {
  const mock = new MockAdapter(api);

  // Mock popular films endpoint
  mock.onGet(/\/movie\/popular/).reply(200, {
    page: 1,
    results: mockMovies,
    total_pages: 500,
    total_results: 10000,
  });

  // Mock top rated films endpoint
  mock.onGet(/\/movie\/top_rated/).reply(200, {
    page: 1,
    results: mockMovies,
    total_pages: 500,
    total_results: 10000,
  });

  // Mock now playing films endpoint
  mock.onGet(/\/movie\/now_playing/).reply(200, {
    page: 1,
    results: mockMovies,
    total_pages: 500,
    total_results: 10000,
  });

  // Mock film detail endpoint
  mock.onGet(/\/movie\/\d+/).reply((config) => {
    const url = config.url || "";
    const idMatch = url.match(/\/movie\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1], 10) : 1;

    return [
      200,
      {
        ...mockMovieDetail,
        id,
      },
    ];
  });

  // Mock search endpoint
  mock.onGet(/\/search\/movie/).reply(200, {
    page: 1,
    results: mockMovies.slice(0, 2), // Return fewer results for search
    total_pages: 1,
    total_results: 2,
  });

  return mock;
};

export const createMockError = (
  mock: MockAdapter,
  endpoint: string,
  status: number = 500
) => {
  mock.reset();
  mock.onGet(new RegExp(endpoint)).reply(status, {
    status_message: "Internal server error.",
    status_code: status,
  });
};

export const createNetworkError = (mock: MockAdapter, endpoint: string) => {
  mock.reset();
  mock.onGet(new RegExp(endpoint)).networkError();
};

export const createTimeoutError = (mock: MockAdapter, endpoint: string) => {
  mock.onGet(new RegExp(endpoint)).timeout();
};
