/**
 * Store 사용 예제 컴포넌트
 * Task 3.3 구현 테스트용
 */

import { useEffect } from 'react';
import { useAuthStore, useTodoStore } from '@/stores';

export function AuthExample() {
  const {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login('test@example.com', 'password123');
      console.log('로그인 성공!');
    } catch (err) {
      console.error('로그인 실패:', err);
    }
  };

  const handleRegister = async () => {
    try {
      await register('new@example.com', 'password123', 'newuser');
      console.log('회원가입 성공!');
    } catch (err) {
      console.error('회원가입 실패:', err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Auth Store 예제</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="text-sm underline mt-2"
          >
            닫기
          </button>
        </div>
      )}

      {isAuthenticated ? (
        <div>
          <p className="mb-2">
            환영합니다, <strong>{user?.username}</strong>님!
          </p>
          <p className="text-sm text-gray-600 mb-4">
            이메일: {user?.email}
          </p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="space-x-2">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? '처리 중...' : '로그인'}
          </button>
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </button>
        </div>
      )}
    </div>
  );
}

export function TodoExample() {
  const {
    todos,
    fetchTodos,
    addTodo,
    toggleComplete,
    deleteTodo,
    isLoading,
    error,
    clearError,
  } = useTodoStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 Todo 목록 조회
    fetchTodos('active').catch((err) => {
      console.error('Todo 목록 조회 실패:', err);
    });
  }, [fetchTodos]);

  const handleAddTodo = async () => {
    try {
      await addTodo({
        title: `새로운 할 일 ${new Date().toLocaleTimeString()}`,
        content: '예제 Todo입니다.',
      });
      console.log('Todo 추가 성공!');
    } catch (err) {
      console.error('Todo 추가 실패:', err);
    }
  };

  const handleToggle = async (todoId: string) => {
    try {
      await toggleComplete(todoId);
    } catch (err) {
      console.error('상태 변경 실패:', err);
    }
  };

  const handleDelete = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
      console.log('Todo 삭제 성공!');
    } catch (err) {
      console.error('Todo 삭제 실패:', err);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Todo Store 예제</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            onClick={clearError}
            className="text-sm underline mt-2"
          >
            닫기
          </button>
        </div>
      )}

      <button
        onClick={handleAddTodo}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4"
      >
        {isLoading ? '처리 중...' : 'Todo 추가'}
      </button>

      {isLoading && todos.length === 0 ? (
        <p>로딩 중...</p>
      ) : todos.length === 0 ? (
        <p className="text-gray-500">Todo가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.todoId}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleToggle(todo.todoId)}
                  className="w-5 h-5"
                />
                <div>
                  <p
                    className={
                      todo.isCompleted
                        ? 'line-through text-gray-500'
                        : 'text-black'
                    }
                  >
                    {todo.title}
                  </p>
                  {todo.content && (
                    <p className="text-sm text-gray-600">{todo.content}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(todo.todoId)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * 전체 예제를 모아놓은 컴포넌트
 */
export default function StoreExamples() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Store 사용 예제</h1>
      <AuthExample />
      <TodoExample />
    </div>
  );
}
