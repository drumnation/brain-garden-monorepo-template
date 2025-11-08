export interface User {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
}

export interface UpdateUserInput {
  name?: string;
}
