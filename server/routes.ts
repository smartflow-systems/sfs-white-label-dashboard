import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import stripeRouter from "./routes/stripe";
import tenantsRouter from "./routes/tenants";
import billingRouter from "./routes/billing";
import clientsRouter from "./routes/clients";
import { resolveTenant } from "./middleware/tenant";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/health", (_req, res) => res.json({ ok: true, service: "sfs-white-label-dashboard" }));
  app.get("/api/health", (_req, res) => res.json({ ok: true, message: "SFS Family Dashboard is running!" }));

  // Resolve tenant on all requests
  app.use(resolveTenant);

  // API routes
  app.use("/api/stripe", stripeRouter);
  app.use("/api/tenants", tenantsRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/clients", clientsRouter);

  const httpServer = createServer(app);
  return httpServer;
}
