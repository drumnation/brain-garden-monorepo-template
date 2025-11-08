import type { Request, Response, NextFunction } from 'express';
import type { UserService } from './user.service.js';

export const makeUserController = (deps: { service: UserService }) => ({
  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await deps.service.getAll();
      res.json(items);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await deps.service.getById(req.params.id);
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await deps.service.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await deps.service.update(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deps.service.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
});

export type UserController = ReturnType<typeof makeUserController>;
