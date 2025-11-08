import express from 'express';
import cors from 'cors';
import { logger } from '@shared/logging/logger.js';
import { createRoutes } from './routes.js';
import { errorHandler } from '@shared/errors/handler.js';

export function createServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  // Request logging
  app.use((req, _res, next) => {
    logger.info({ method: req.method, path: req.path }, 'Incoming request');
    next();
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  createRoutes(app);

  // Error handling
  app.use(errorHandler);

  return app;
}
