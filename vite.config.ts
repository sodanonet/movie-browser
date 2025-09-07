import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "");
  return {
    define: {
      "process.env.VITE_TMDB_API_KEY": JSON.stringify(env.VITE_TMDB_API_KEY),
      "process.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL),
      "process.env.VITE_APP_TITLE": JSON.stringify(env.VITE_APP_TITLE),
    },
    plugins: [react()],
    resolve: {
      alias: {},
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            redux: ["@reduxjs/toolkit", "react-redux"],
            http: ["axios"],
          },
        },
      },
    },
    server: {
      port: 5174,
      host: true,
    },
  };
});
