## 📋 설명

메인 페이지에서 할일 목록 조회, 추가, 수정, 삭제, 완료 기능을 구현합니다.

## ✅ Todo

- [ ] 페이지 진입 시 할일 목록 API 호출 및 `TodoCard` 컴포넌트로 렌더링
- [ ] 할일 추가/수정 모달 기능 및 관련 API 연동 완료
- [ ] 할일 완료/삭제 기능 및 관련 API 연동 완료

## ✅ 완료 조건

### 1. 할일 목록 페이지 (`src/pages/TodoListPage.tsx`)

**UI 구성**:
- 할일 추가 버튼
- 할일 목록 (TodoCard 컴포넌트)
- 필터/정렬 옵션 (선택)
- 빈 상태 메시지 (할일이 없을 때)

**기능**:
- 페이지 진입 시 할일 목록 API 호출
- 할일 추가 버튼 클릭 → 모달 열기
- 할일 완료 체크박스 → 완료 상태 토글 API 호출
- 할일 수정 버튼 → 모달 열기
- 할일 삭제 버튼 → 삭제 확인 후 API 호출

### 2. 할일 모달 (`src/components/TodoModal.tsx`)

**UI 구성**:
- 제목 입력 필드
- 설명 입력 필드 (Textarea)
- 마감일 선택 (Date picker)
- 저장/취소 버튼

**모드**:
- 추가 모드: 빈 폼
- 수정 모드: 기존 할일 데이터로 폼 초기화

**유효성 검사**:
- 제목: 1-200자, 필수
- 설명: 최대 1000자, 선택
- 마감일: 오늘 이후 날짜, 선택

### 3. API 서비스 함수 (`src/api/todos.ts`)

```typescript
export const todoAPI = {
  getAll: async () => { ... },
  getById: async (id: string) => { ... },
  create: async (data: CreateTodoInput) => { ... },
  update: async (id: string, data: UpdateTodoInput) => { ... },
  toggleComplete: async (id: string) => { ... },
  delete: async (id: string) => { ... },
  restore: async (id: string) => { ... },
};
```

### 4. 할일 목록 렌더링
- 로딩 상태: 스켈레톤 또는 스피너
- 빈 상태: "할일이 없습니다" 메시지
- 에러 상태: 에러 메시지 및 재시도 버튼

### 5. 실시간 업데이트
- 할일 추가 → 목록에 즉시 반영
- 할일 수정 → 목록에 즉시 반영
- 할일 삭제 → 목록에서 제거
- 할일 완료 → 체크박스 즉시 업데이트

### 6. (선택) 필터 및 정렬
- 상태별 필터: 전체, 진행 중, 완료
- 정렬: 생성일, 마감일

## 🔧 기술적 고려사항

**할일 목록 페이지 예시**:
```tsx
// src/pages/TodoListPage.tsx
import { useEffect, useState } from 'react';
import { useTodoStore } from '@/store/todoStore';
import { todoAPI } from '@/api/todos';
import TodoCard from '@/components/common/TodoCard';
import TodoModal from '@/components/TodoModal';
import Button from '@/components/common/Button';

export default function TodoListPage() {
  const { todos, setTodos } = useTodoStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const data = await todoAPI.getAll();
      setTodos(data.todos);
    } catch (error) {
      console.error('할일 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const result = await todoAPI.toggleComplete(id);
      useTodoStore.getState().updateTodo(id, result.todo);
    } catch (error) {
      console.error('할일 완료 상태 변경 실패:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await todoAPI.delete(id);
      useTodoStore.getState().deleteTodo(id);
    } catch (error) {
      console.error('할일 삭제 실패:', error);
    }
  };

  const handleAddNew = () => {
    setSelectedTodo(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">할일 목록</h1>
        <Button onClick={handleAddNew}>할일 추가</Button>
      </div>

      {todos.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          할일이 없습니다. 새로운 할일을 추가해보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        todo={selectedTodo}
        onSuccess={loadTodos}
      />
    </div>
  );
}
```

**할일 모달 예시**:
```tsx
// src/components/TodoModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, TodoInput } from '@/schemas/todo.schema';
import { todoAPI } from '@/api/todos';
import Modal from './common/Modal';
import Input from './common/Input';
import Textarea from './common/Textarea';
import Button from './common/Button';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo | null;
  onSuccess: () => void;
}

export default function TodoModal({ isOpen, onClose, todo, onSuccess }: TodoModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: todo || {},
  });

  const onSubmit = async (data: TodoInput) => {
    try {
      if (todo) {
        await todoAPI.update(todo.id, data);
      } else {
        await todoAPI.create(data);
      }
      onSuccess();
      onClose();
      reset();
    } catch (error) {
      console.error('할일 저장 실패:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={todo ? '할일 수정' : '할일 추가'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="제목"
          {...register('title')}
          error={errors.title?.message}
        />

        <Textarea
          label="설명"
          {...register('description')}
          error={errors.description?.message}
        />

        <Input
          label="마감일"
          type="date"
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose} type="button">
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

**Todo Zod 스키마 예시**:
```typescript
// src/schemas/todo.schema.ts
import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(200, '제목은 200자 이하여야 합니다'),
  description: z.string().max(1000, '설명은 1000자 이하여야 합니다').optional(),
  dueDate: z.string().optional(),
});

export type TodoInput = z.infer<typeof todoSchema>;
```

**API 서비스 예시**:
```typescript
// src/api/todos.ts
import api from './axios';
import { TodoInput } from '@/schemas/todo.schema';

export const todoAPI = {
  getAll: async () => {
    const response = await api.get('/todos');
    return response.data;
  },

  create: async (data: TodoInput) => {
    const response = await api.post('/todos', data);
    return response.data;
  },

  update: async (id: string, data: TodoInput) => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data;
  },

  toggleComplete: async (id: string) => {
    const response = await api.patch(`/todos/${id}/complete`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch(`/todos/${id}/restore`);
    return response.data;
  },
};
```

**주의사항**:
- API 호출 후 Zustand store 업데이트로 UI 즉시 반영
- 에러 발생 시 사용자 친화적인 메시지 표시
- 삭제 시 확인 다이얼로그 표시
- 모달 닫을 때 폼 초기화

## 🔗 의존성

**선행 작업**:
- Task 3.1: 라우팅 및 페이지 레이아웃 설정
- Task 3.2: 공통 UI 컴포넌트 개발
- Task 3.3: 전역 상태 및 API 클라이언트 설정

**API 의존성**:
- Task 2.4: 할일 API 구현

**후행 작업**:
- Task 3.6: 휴지통 페이지 구현

## 👤 담당

`javascript-pro`

## 📚 참고 문서

- docs/3-prd.md (10.2장: 페이지 구성 - 할일 목록)
- React Hook Form: https://react-hook-form.com/
- Zustand: https://zustand-demo.pmnd.rs/
