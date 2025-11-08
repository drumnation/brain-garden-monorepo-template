import type { Express, Router } from 'express';
import { Router as createRouter } from 'express';

import { makeUserRepository } from './user.repo.js';
import { makeUserService } from './user.service.js';
import { makeUserController } from './user.controller.js';

export * from './user.types.js';

export function createUserRoutes(app: Express): Router {
  // Create dependencies
  const repository = makeUserRepository();
  const service = makeUserService({ repository });
  const controller = makeUserController({ service });

  // Create router
  const router = createRouter();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  // Mount router
  app.use('/api/user', router);

  return router;
}
