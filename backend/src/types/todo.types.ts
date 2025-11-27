export interface Todo {
  todoId: string;
  userId: string;
  title: string;
  content?: string;
  startDate?: Date;
  dueDate?: Date;
  status: 'active' | 'completed' | 'deleted';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateTodoRequest {
  title: string;
  content?: string;
  startDate?: string; // ISO string format
  dueDate?: string; // ISO string format
}

export interface UpdateTodoRequest {
  title?: string;
  content?: string;
  startDate?: string; // ISO string format
  dueDate?: string; // ISO string format
}

export interface TodoListQuery {
  status?: 'active' | 'completed' | 'deleted';
  isCompleted?: boolean;
  dueDate?: string; // ISO string format
}