import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
const port = 3000;

// Performance monitoring in SSR
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`SSR ${req.url}: ${duration}ms`);

    // Send metrics to monitoring service
    if (duration > 1000) {
      console.warn(`Slow SSR response: ${req.url} took ${duration}ms`);
    }
  });

  next();
};
app.use(performanceMiddleware);

// Serve static assets (but not HTML files)
app.use("/assets", express.static("dist/assets"));
app.use("/vite.svg", express.static("dist/vite.svg"));

// SSR handler for HTML pages
app.use(async (req, res, next) => {
  // Only handle GET requests for HTML content
  if (req.method !== "GET" || req.url.includes(".")) {
    return next();
  }
  try {
    const url = req.originalUrl;

    // Read the built HTML template
    const template = await fs.readFile(
      path.resolve("dist/index.html"),
      "utf-8"
    );

    // Import the server entry point (built with Vite)
    const { render } = await import("./dist/server/entry-server.js");

    // Render the app
    const { html } = await render(url);

    // Replace the SSR placeholder with rendered content
    const finalHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    res.set({ "Content-Type": "text/html" }).send(finalHtml);
  } catch (error) {
    console.error("SSR Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`SSR server running at http://localhost:${port}`);
});
