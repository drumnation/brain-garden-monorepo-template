import type { Express } from 'express';
import { createUserRoutes } from '@modules/user/index.js';

export function createRoutes(app: Express) {
  const apiRouter = app;

  // Register module routes
  createUserRoutes(apiRouter);

  // 404 handler
  apiRouter.use('*', (_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
}
