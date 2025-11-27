import React from 'react';
import type { Todo } from '@/types';
import Button from './Button';

interface TrashCardProps {
  todo: Todo;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

const TrashCard: React.FC<TrashCardProps> = ({ todo, onRestore, onPermanentDelete }) => {
  /**
   * 날짜 포맷팅 함수
   * @param dateString - ISO 날짜 문자열
   * @returns 한국 형식의 날짜/시간 문자열
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return '알 수 없음';

    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '알 수 없음';
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* 내용 영역 */}
        <div className="flex-1 min-w-0">
          {/* 제목 - 취소선과 회색 텍스트로 삭제된 상태 표현 */}
          <h3 className="text-base font-medium text-gray-600 line-through mb-1">
            {todo.title}
          </h3>

          {/* 내용 미리보기 */}
          {todo.content && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {todo.content}
            </p>
          )}

          {/* 삭제일시 */}
          <p className="text-xs text-gray-400 mt-2">
            삭제일: {formatDate(todo.deletedAt)}
          </p>
        </div>

        {/* 액션 버튼 영역 */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onRestore(todo.todoId)}
            aria-label={`할일 복원: ${todo.title}`}
          >
            복원
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onPermanentDelete(todo.todoId)}
            aria-label={`할일 영구 삭제: ${todo.title}`}
          >
            영구 삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrashCard;
