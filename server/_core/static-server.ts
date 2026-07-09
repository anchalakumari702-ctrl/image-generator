import express, { type Express } from "express";
import fs from "fs";
import path from "path";

/**
 * Production-only static file serving
 * No vite dependencies - safe for production bundling
 */
export function serveStaticProduction(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "../..", "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
