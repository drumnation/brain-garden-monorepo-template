import { Router } from 'express';
import type { Logger } from '@kit/logger';
// Import module routes as they're created
// import { createCalendarRoutes } from '@server/modules/calendar/calendar.routes.js';
// import { createTaskRoutes } from '@server/modules/tasks/task.routes.js';

interface RouteDeps {
  logger: Logger;
}

export const createRoutes = (deps: RouteDeps): Router => {
  const router = Router();

  // Mount module routes
  // router.use('/calendar', createCalendarRoutes(deps));
  // router.use('/tasks', createTaskRoutes(deps));

  // Placeholder route
  router.get('/', (_req, res) => {
    res.json({ message: 'Scheduling API v1' });
  });

  return router;
};
