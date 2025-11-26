## 📋 설명

`/trash` 페이지에서 삭제된 할일 목록 조회, 복원, 영구 삭제 기능을 구현합니다.

## ✅ Todo

- [ ] 페이지 진입 시 휴지통 목록 API 호출 및 렌더링
- [ ] 복원, 영구 삭제 기능 및 관련 API 연동 완료

## ✅ 완료 조건

### 1. 휴지통 페이지 (`src/pages/TrashPage.tsx`)

**UI 구성**:
- 페이지 제목: "휴지통"
- 삭제된 할일 목록 (TodoCard 변형)
- 빈 상태 메시지 (휴지통이 비어있을 때)

**기능**:
- 페이지 진입 시 휴지통 목록 API 호출
- 복원 버튼 → 할일 복원 API 호출 → 목록에서 제거
- 영구 삭제 버튼 → 확인 다이얼로그 → 영구 삭제 API 호출 → 목록에서 제거

### 2. 휴지통 카드 컴포넌트

**옵션 1**: TodoCard 컴포넌트 재사용
- mode prop 추가 (`'normal' | 'trash'`)
- trash 모드일 때 복원/영구삭제 버튼 표시

**옵션 2**: 별도 TrashCard 컴포넌트 생성
- 삭제 날짜 표시
- 복원 버튼
- 영구 삭제 버튼

### 3. API 서비스 함수 (`src/api/trash.ts`)

```typescript
export const trashAPI = {
  getAll: async () => { ... },
  permanentDelete: async (id: string) => { ... },
};
```

### 4. 휴지통 목록 렌더링
- 로딩 상태: 스켈레톤 또는 스피너
- 빈 상태: "휴지통이 비어있습니다" 메시지
- 에러 상태: 에러 메시지 및 재시도 버튼

### 5. 영구 삭제 확인
- 영구 삭제 시 확인 다이얼로그 표시
- "정말 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."

### 6. 실시간 업데이트
- 복원 → 휴지통 목록에서 제거
- 영구 삭제 → 휴지통 목록에서 제거

## 🔧 기술적 고려사항

**휴지통 페이지 예시**:
```tsx
// src/pages/TrashPage.tsx
import { useEffect, useState } from 'react';
import { trashAPI } from '@/api/trash';
import { todoAPI } from '@/api/todos';
import TrashCard from '@/components/TrashCard';
import Button from '@/components/common/Button';

export default function TrashPage() {
  const [trashedTodos, setTrashedTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrash();
  }, []);

  const loadTrash = async () => {
    try {
      setIsLoading(true);
      const data = await trashAPI.getAll();
      setTrashedTodos(data.todos);
    } catch (error) {
      console.error('휴지통 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await todoAPI.restore(id);
      setTrashedTodos((prev) => prev.filter((todo) => todo.id !== id));
      alert('할일이 복원되었습니다');
    } catch (error) {
      console.error('할일 복원 실패:', error);
      alert('복원에 실패했습니다');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('정말 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      await trashAPI.permanentDelete(id);
      setTrashedTodos((prev) => prev.filter((todo) => todo.id !== id));
      alert('할일이 영구적으로 삭제되었습니다');
    } catch (error) {
      console.error('영구 삭제 실패:', error);
      alert('삭제에 실패했습니다');
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">휴지통</h1>

      {trashedTodos.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          휴지통이 비어있습니다
        </div>
      ) : (
        <div className="space-y-4">
          {trashedTodos.map((todo) => (
            <TrashCard
              key={todo.id}
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
```

**휴지통 카드 컴포넌트 예시**:
```tsx
// src/components/TrashCard.tsx
import { Todo } from '@/types/todo';
import Button from './common/Button';

interface TrashCardProps {
  todo: Todo;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export default function TrashCard({ todo, onRestore, onPermanentDelete }: TrashCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-500 line-through">
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-sm text-gray-600 mt-1 line-through">
              {todo.description}
            </p>
          )}
          {todo.deletedAt && (
            <p className="text-xs text-gray-400 mt-2">
              삭제일: {new Date(todo.deletedAt).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onRestore(todo.id)}>
            복원
          </Button>
          <Button variant="danger" size="sm" onClick={() => onPermanentDelete(todo.id)}>
            영구 삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**API 서비스 예시**:
```typescript
// src/api/trash.ts
import api from './axios';

export const trashAPI = {
  getAll: async () => {
    const response = await api.get('/trash');
    return response.data;
  },

  permanentDelete: async (id: string) => {
    const response = await api.delete(`/trash/${id}`);
    return response.data;
  },
};
```

**TodoCard 컴포넌트를 재사용하는 경우**:
```tsx
// src/components/common/TodoCard.tsx에 mode prop 추가
interface TodoCardProps {
  todo: Todo;
  mode?: 'normal' | 'trash';
  onToggleComplete?: (id: string) => void;
  onEdit?: (todo: Todo) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

// trash 모드일 때 다른 버튼 표시
{mode === 'trash' ? (
  <>
    <Button variant="secondary" size="sm" onClick={() => onRestore?.(todo.id)}>
      복원
    </Button>
    <Button variant="danger" size="sm" onClick={() => onPermanentDelete?.(todo.id)}>
      영구 삭제
    </Button>
  </>
) : (
  // ... 기존 버튼
)}
```

**주의사항**:
- 영구 삭제는 되돌릴 수 없으므로 반드시 확인 다이얼로그 표시
- 복원 시 메인 페이지 할일 목록에 자동 반영되지 않음 (페이지 새로고침 필요 또는 전역 상태 업데이트)
- 삭제 날짜 표시로 사용자에게 정보 제공
- 에러 발생 시 명확한 피드백 제공

**개선 사항 (선택)**:
- 일괄 복원/삭제 기능
- 자동 삭제 (30일 후) 알림
- 복원 후 메인 페이지 할일 목록 자동 업데이트

## 🔗 의존성

**선행 작업**:
- Task 3.1: 라우팅 및 페이지 레이아웃 설정
- Task 3.2: 공통 UI 컴포넌트 개발
- Task 3.3: 전역 상태 및 API 클라이언트 설정

**API 의존성**:
- Task 2.5: 휴지통 API 구현

**후행 작업**:
- Task 4.1: E2E 테스트 및 버그 수정

## 👤 담당

`frontend-developer`

## 📚 참고 문서

- docs/3-prd.md (10.2장: 페이지 구성 - 휴지통)
- React 상태 관리: https://react.dev/learn/managing-state
