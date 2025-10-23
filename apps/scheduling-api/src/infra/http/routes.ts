import { Router } from 'express';
import type { Logger } from '@kit/logger';

interface RouteDeps {
  logger: Logger;
}

export const createRoutes = (deps: RouteDeps): Router => {
  const router = Router();

  // Placeholder route
  router.get('/', (_req, res) => {
    res.json({ message: 'Scheduling API v1' });
  });

  return router;
};
