import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import stripeRouter from "./routes/stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, message: "SFS Family Dashboard is running!" });
  });

  // Stripe payment routes
  app.use("/api/stripe", stripeRouter);

  // Future API routes will go here
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
