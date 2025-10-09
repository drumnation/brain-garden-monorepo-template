/**
 * Task status enum
 */
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Task priority enum
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Represents a task
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignee?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new task
 */
export interface TaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  assignee?: string;
  tags?: string[];
}

/**
 * Input for updating an existing task
 */
export type TaskUpdate = Partial<TaskInput>;
