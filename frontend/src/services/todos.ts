import apiClient from './api';
import type { Todo } from '@/types';

export interface CreateTodoInput {
  title: string;
  content?: string;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  content?: string;
  startDate?: string;
  dueDate?: string;
}

export const todoService = {
  /**
   * Todo 목록 조회
   * @param status - 필터링할 상태 (active, completed, deleted)
   */
  getTodos: async (status?: 'active' | 'completed' | 'deleted'): Promise<Todo[]> => {
    const response = await apiClient.get<{ data: Todo[] }>('/todos', {
      params: status ? { status } : undefined,
    });
    return response.data.data;
  },

  /**
   * 특정 Todo 조회
   * @param id - Todo ID
   */
  getTodo: async (id: string): Promise<Todo> => {
    const response = await apiClient.get<{ data: Todo }>(`/todos/${id}`);
    return response.data.data;
  },

  /**
   * Todo 생성
   * @param todo - Todo 생성 데이터
   */
  createTodo: async (todo: CreateTodoInput): Promise<Todo> => {
    const response = await apiClient.post<{ data: Todo }>('/todos', todo);
    return response.data.data;
  },

  /**
   * Todo 수정
   * @param id - Todo ID
   * @param updates - 수정할 데이터
   */
  updateTodo: async (id: string, updates: UpdateTodoInput): Promise<Todo> => {
    const response = await apiClient.put<{ data: Todo }>(`/todos/${id}`, updates);
    return response.data.data;
  },

  /**
   * Todo 완료 상태 토글
   * @param id - Todo ID
   */
  toggleComplete: async (id: string): Promise<Todo> => {
    const response = await apiClient.patch<{ data: Todo }>(`/todos/${id}/complete`);
    return response.data.data;
  },

  /**
   * Todo 삭제 (휴지통으로 이동)
   * @param id - Todo ID
   */
  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },

  /**
   * Todo 복원
   * @param id - Todo ID
   */
  restoreTodo: async (id: string): Promise<Todo> => {
    const response = await apiClient.patch<{ data: Todo }>(`/todos/${id}/restore`);
    return response.data.data;
  },

  /**
   * Todo 영구 삭제
   * @param id - Todo ID
   */
  permanentlyDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/trash/${id}`);
  },
};
