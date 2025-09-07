import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { createHtmlPlugin } from "vite-plugin-html";

// Check if this is an SSR build by looking at the command line arguments
const isSSRBuild = process.argv.includes("--ssr");

export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "");
  return {
    define: {
      "process.env.VITE_TMDB_API_KEY": JSON.stringify(env.VITE_TMDB_API_KEY),
      "process.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL),
      "process.env.VITE_APP_TITLE": JSON.stringify(env.VITE_APP_TITLE),
    },
    plugins: [
      react(),
      // HTML optimization
      createHtmlPlugin({
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true,
        },
      }),
      // Bundle analyzer - generates stats.html (only for client build)
      !isSSRBuild &&
        (visualizer({
          filename: "dist/stats.html",
          open: false, // Don't auto-open in CI/CD
          gzipSize: true,
          brotliSize: true,
        }) as any),
    ].filter(Boolean),
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    resolve: {
      alias: {},
    },
    build: {
      // Optimize chunks
      rollupOptions: {
        // Only set input and manualChunks for client builds
        ...(isSSRBuild
          ? {}
          : {
              input: {
                main: "./index.html",
              },
              output: {
                manualChunks: {
                  // Vendor chunk for large dependencies
                  vendor: ["react", "react-dom", "react-router-dom"],
                  // Redux chunk
                  redux: ["@reduxjs/toolkit", "react-redux"],
                  // API chunk
                  api: ["axios"],
                },
              },
            }),
        // For SSR builds, externalize dependencies
        ...(isSSRBuild
          ? {
              external: [
                "react",
                "react-dom",
                "react-router-dom",
                "@reduxjs/toolkit",
                "react-redux",
                "axios",
              ],
            }
          : {}),
      },
    },
    server: {
      port: 5174,
      host: true,
    },
    // Dependency optimization
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-redux",
        "@reduxjs/toolkit",
        "react-router-dom",
        "axios",
      ],
      exclude: ["@testing-library/jest-dom"],
    },
  };
});
