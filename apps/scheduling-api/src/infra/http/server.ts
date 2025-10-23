import express, { type Express } from 'express';
import type { Logger } from '@kit/logger';
import { createRoutes } from './routes.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';

interface ServerDeps {
  logger: Logger;
}

export const createServer = (deps: ServerDeps): Express => {
  const app = express();

  // Global middleware
  app.use(express.json());
  app.use(requestLogger(deps.logger));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/v1', createRoutes(deps));

  // Error handling (must be last)
  app.use(errorHandler(deps.logger));

  return app;
};
