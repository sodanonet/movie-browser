import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5174",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    env: {
      VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
      VITE_TMDB_API_KEY: process.env.VITE_TMDB_API_KEY,
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  video: false,
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 720,
});
