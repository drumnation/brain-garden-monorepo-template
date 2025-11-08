import type { UserRepository } from './user.repo.js';
import type { CreateUserInput, UpdateUserInput } from './user.types.js';
import { AppError } from '@shared/errors/handler.js';

export const makeUserService = (deps: { repository: UserRepository }) => ({
  async getAll() {
    return deps.repository.findAll();
  },

  async getById(id: string) {
    const user = await deps.repository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async create(input: CreateUserInput) {
    // Add business logic validation here
    return deps.repository.create(input);
  },

  async update(id: string, input: UpdateUserInput) {
    const user = await deps.repository.update(id, input);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async delete(id: string) {
    const success = await deps.repository.delete(id);
    if (!success) {
      throw new AppError('User not found', 404);
    }
  },
});

export type UserService = ReturnType<typeof makeUserService>;
