import type { User, CreateUserInput, UpdateUserInput } from './user.types.js';


export const makeUserRepository = () => ({
  async findAll(): Promise<User[]> {
    // TODO: Implement database query
    return [];
  },

  async findById(id: string): Promise<User | null> {
    // TODO: Implement database query
    return null;
  },

  async create(input: CreateUserInput): Promise<User> {
    // TODO: Implement database insert
    return {
      id: 'temp-id',
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    // TODO: Implement database update
    return null;
  },

  async delete(id: string): Promise<boolean> {
    // TODO: Implement database delete
    return false;
  },
});

export type UserRepository = ReturnType<typeof makeUserRepository>;
