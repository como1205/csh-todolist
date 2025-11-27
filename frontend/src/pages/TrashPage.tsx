import { useEffect } from 'react';
import { useTodoStore } from '@/stores/todoStore';
import TrashCard from '@/components/ui/TrashCard';

export default function TrashPage() {
  const { todos, isLoading, error, fetchTodos, restoreTodo, permanentlyDeleteTodo, clearError } =
    useTodoStore();

  // 컴포넌트 마운트 시 삭제된 할일 목록 불러오기
  useEffect(() => {
    fetchTodos('deleted');
  }, [fetchTodos]);

  /**
   * 복원 처리 핸들러
   */
  const handleRestore = async (id: string) => {
    if (window.confirm('이 할일을 복원하시겠습니까?')) {
      try {
        await restoreTodo(id);
        // 복원 성공 시 목록에서 자동으로 제거됨 (상태가 active로 변경되므로)
      } catch (error) {
        // 에러는 store에서 처리
        console.error('복원 실패:', error);
      }
    }
  };

  /**
   * 영구 삭제 처리 핸들러
   */
  const handlePermanentDelete = async (id: string) => {
    if (
      window.confirm(
        '정말로 영구 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      try {
        await permanentlyDeleteTodo(id);
        // 성공 시 목록에서 자동으로 제거됨
      } catch (error) {
        // 에러는 store에서 처리
        console.error('영구 삭제 실패:', error);
      }
    }
  };

  // 삭제된 할일만 필터링
  const deletedTodos = todos.filter((todo) => todo.status === 'deleted');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">휴지통</h1>
      </div>

      {/* 안내 메시지 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-gray-700">
          삭제된 할일은 이곳에 보관됩니다. 영구 삭제 시 복구할 수 없습니다.
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">오류 발생</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
              aria-label="오류 메시지 닫기"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
            <p className="text-sm text-gray-500">로딩 중...</p>
          </div>
        </div>
      ) : deletedTodos.length === 0 ? (
        /* 빈 상태 */
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col items-center gap-3">
            {/* 휴지통 아이콘 */}
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-400 mb-1">
                휴지통이 비어있습니다
              </p>
              <p className="text-sm text-gray-500">삭제된 할일이 없습니다</p>
            </div>
          </div>
        </div>
      ) : (
        /* 휴지통 목록 */
        <div className="space-y-4">
          {deletedTodos.map((todo) => (
            <TrashCard
              key={todo.todoId}
              todo={todo}
              onRestore={handleRestore}
              onPermanentDelete={handlePermanentDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
