import React from 'react';
import Checkbox from './Checkbox';
import Badge from './Badge';

export interface TodoCardProps {
  todo: {
    todoId: string;
    title: string;
    content?: string;
    dueDate?: string;
    isCompleted: boolean;
    status: 'active' | 'completed' | 'deleted';
  };
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  // 만료 임박 여부 체크 (3일 이내)
  const isOverdue = () => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0; // 기한 초과
  };

  const isApproaching = () => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3; // 3일 이내
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 상태 뱃지 결정
  const getStatusBadge = () => {
    if (todo.isCompleted) {
      return <Badge status="completed">완료</Badge>;
    }
    if (isOverdue()) {
      return <Badge status="overdue">기한 초과</Badge>;
    }
    return <Badge status="active">진행 중</Badge>;
  };

  // 카드 스타일 결정
  const cardStyles = `
    p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200
    ${isOverdue() && !todo.isCompleted ? 'border-l-4 border-red-500 bg-red-50' : 'border-gray-200'}
    ${isApproaching() && !todo.isCompleted && !isOverdue() ? 'border-l-4 border-orange-400 bg-orange-50' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={cardStyles}>
      <div className="flex items-start gap-3">
        {/* 체크박스 */}
        <div className="pt-0.5">
          <Checkbox
            checked={todo.isCompleted}
            onChange={() => onToggleComplete(todo.todoId)}
            aria-label={`할일 완료 상태 토글: ${todo.title}`}
          />
        </div>

        {/* 내용 영역 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3
            className={`text-base font-medium mb-1 ${
              todo.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </h3>

          {/* 내용 */}
          {todo.content && (
            <p
              className={`text-sm mb-2 line-clamp-2 ${
                todo.isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {todo.content}
            </p>
          )}

          {/* 하단 정보 */}
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
            {todo.dueDate && (
              <span
                className={`text-xs ${
                  isOverdue() && !todo.isCompleted
                    ? 'text-red-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                만료일: {formatDate(todo.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(todo.todoId)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label={`할일 수정: ${todo.title}`}
          >
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.todoId)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            aria-label={`할일 삭제: ${todo.title}`}
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
