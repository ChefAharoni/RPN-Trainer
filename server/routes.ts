import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since this is a static application that runs entirely in the browser,
  // we don't need any API routes. All logic is handled client-side.
  
  const httpServer = createServer(app);
  return httpServer;
}
