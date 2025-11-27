import { useEffect, useState } from 'react';
import { useTodoStore } from '@/stores/todoStore';
import { Button, TodoCard, TodoFormModal } from '@/components/ui';
import type { Todo } from '@/types';

export default function TodoListPage() {
  const { todos, isLoading, error, fetchTodos, toggleComplete, deleteTodo } = useTodoStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // 페이지 진입 시 할일 목록 로드
  useEffect(() => {
    fetchTodos('active');
  }, [fetchTodos]);

  // 할일 수정 모달 열기
  const handleEdit = (todoId: string) => {
    const todo = todos.find((t) => t.todoId === todoId);
    if (todo) {
      setSelectedTodo(todo);
      setIsEditModalOpen(true);
    }
  };

  // 할일 삭제 (휴지통으로 이동)
  const handleDelete = async (todoId: string) => {
    if (window.confirm('이 할일을 삭제하시겠습니까?')) {
      try {
        await deleteTodo(todoId);
      } catch (error) {
        console.error('할일 삭제 실패:', error);
      }
    }
  };

  // 할일 완료 상태 토글
  const handleToggleComplete = async (todoId: string) => {
    try {
      await toggleComplete(todoId);
    } catch (error) {
      console.error('할일 완료 상태 변경 실패:', error);
    }
  };

  // 에러 표시
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">할일 목록</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          할일 추가
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && todos.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
      ) : todos.length === 0 ? (
        /* 할일 없음 메시지 */
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              할일이 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              새로운 할일을 추가해보세요!
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              첫 할일 추가하기
            </Button>
          </div>
        </div>
      ) : (
        /* 할일 목록 */
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo.todoId}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 할일 추가 모달 */}
      <TodoFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="add"
      />

      {/* 할일 수정 모달 */}
      <TodoFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTodo(null);
        }}
        mode="edit"
        todo={selectedTodo || undefined}
      />
    </div>
  );
}
