export interface User {
  userId: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface Todo {
  todoId: string;
  userId: string;
  title: string;
  content?: string;
  startDate?: string;
  dueDate?: string;
  status: 'active' | 'completed' | 'deleted';
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Holiday {
  holidayId: string;
  title: string;
  date: string;
  description?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}
