import { create } from 'zustand';
import type { Todo } from '@/types';
import { todoService, type CreateTodoInput, type UpdateTodoInput } from '@/services/todos';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTodos: (status?: 'active' | 'completed' | 'deleted') => Promise<void>;
  addTodo: (todo: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoInput) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  restoreTodo: (id: string) => Promise<void>;
  permanentlyDeleteTodo: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  /**
   * Todo 목록 조회
   */
  fetchTodos: async (status?: 'active' | 'completed' | 'deleted') => {
    set({ isLoading: true, error: null });

    try {
      const todos = await todoService.getTodos(status);
      set({ todos, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Todo 목록을 불러오는데 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Todo 추가
   */
  addTodo: async (todoInput: CreateTodoInput) => {
    set({ isLoading: true, error: null });

    try {
      const newTodo = await todoService.createTodo(todoInput);

      // 낙관적 업데이트: 새 Todo를 목록 맨 앞에 추가
      set((state) => ({
        todos: [newTodo, ...state.todos],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Todo 추가에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Todo 수정
   */
  updateTodo: async (id: string, updates: UpdateTodoInput) => {
    set({ isLoading: true, error: null });

    try {
      const updatedTodo = await todoService.updateTodo(id, updates);

      // 낙관적 업데이트: 목록에서 해당 Todo 업데이트
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.todoId === id ? updatedTodo : todo
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Todo 수정에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Todo 완료 상태 토글
   */
  toggleComplete: async (id: string) => {
    // 낙관적 업데이트: UI 즉시 반영
    const originalTodos = get().todos;
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.todoId === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      ),
    }));

    try {
      const updatedTodo = await todoService.toggleComplete(id);

      // 서버 응답으로 최종 업데이트
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.todoId === id ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      // 에러 발생 시 원래 상태로 롤백
      set({ todos: originalTodos });

      const errorMessage =
        error instanceof Error ? error.message : 'Todo 완료 상태 변경에 실패했습니다.';
      set({ error: errorMessage });
      throw error;
    }
  },

  /**
   * Todo 삭제 (휴지통으로 이동)
   */
  deleteTodo: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await todoService.deleteTodo(id);

      // 목록에서 제거
      set((state) => ({
        todos: state.todos.filter((todo) => todo.todoId !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Todo 삭제에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Todo 복원
   */
  restoreTodo: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await todoService.restoreTodo(id);

      // 휴지통(deleted) 목록에서는 제거
      // (복원된 할일은 status가 'active'로 변경되므로 휴지통에서 사라져야 함)
      set((state) => ({
        todos: state.todos.filter((todo) => todo.todoId !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Todo 복원에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Todo 영구 삭제
   */
  permanentlyDeleteTodo: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await todoService.permanentlyDelete(id);

      // 목록에서 완전히 제거
      set((state) => ({
        todos: state.todos.filter((todo) => todo.todoId !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Todo 영구 삭제에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * 에러 초기화
   */
  clearError: () => {
    set({ error: null });
  },
}));
