import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
// Removed: Manus OAuth - using Firebase only
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStaticProduction } from "./static-server";
import { initializeFirebaseAdmin } from "./firebase-admin";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  // Initialize Firebase Admin SDK
  try {
    initializeFirebaseAdmin();
  } catch (error) {
    console.warn("[Server] Firebase Admin initialization warning (may be expected in dev):", error);
  }

  // Dynamically import setupVite only in development
  let setupVite: any = null;
  if (process.env.NODE_ENV === "development") {
    try {
      setupVite = (await import("./vite-dev")).setupVite;
    } catch (error) {
      console.warn("[Server] Failed to load Vite (expected in production):", error);
    }
  }

  const app = express();
  const server = createServer(app);
  const allowedOrigins = new Set([
    "https://prince-f7668.web.app",
    "https://prince-f7668.firebaseapp.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Vary", "Origin");
    }
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  // Removed: Manus OAuth - using Firebase only
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development" && setupVite) {
    await setupVite(app, server);
  } else {
    serveStaticProduction(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
