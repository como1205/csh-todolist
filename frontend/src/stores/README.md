# Store 사용 가이드

## authStore 사용 예제

### 로그인
```typescript
import { useAuthStore } from '@/stores';

function LoginComponent() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // 로그인 성공 시 처리
      console.log('로그인 성공!');
    } catch (error) {
      // 에러 처리 (error state에 자동으로 저장됨)
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

### 회원가입
```typescript
import { useAuthStore } from '@/stores';

function RegisterComponent() {
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    clearError(); // 이전 에러 초기화

    try {
      await register('user@example.com', 'password123', 'username');
      console.log('회원가입 성공!');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? '처리 중...' : '회원가입'}
    </button>
  );
}
```

### 로그아웃
```typescript
import { useAuthStore } from '@/stores';

function LogoutButton() {
  const { logout } = useAuthStore();

  return <button onClick={logout}>로그아웃</button>;
}
```

### 인증 상태 확인
```typescript
import { useAuthStore } from '@/stores';

function ProtectedComponent() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return <div>환영합니다, {user?.username}님!</div>;
}
```

## todoStore 사용 예제

### Todo 목록 조회
```typescript
import { useTodoStore } from '@/stores';
import { useEffect } from 'react';

function TodoList() {
  const { todos, fetchTodos, isLoading, error } = useTodoStore();

  useEffect(() => {
    fetchTodos(); // 모든 Todo 조회
    // 또는
    // fetchTodos('active'); // 활성 Todo만 조회
    // fetchTodos('completed'); // 완료된 Todo만 조회
    // fetchTodos('deleted'); // 삭제된 Todo만 조회
  }, []);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.todoId}>
          {todo.title} - {todo.isCompleted ? '완료' : '미완료'}
        </li>
      ))}
    </ul>
  );
}
```

### Todo 추가
```typescript
import { useTodoStore } from '@/stores';

function AddTodoForm() {
  const { addTodo, isLoading } = useTodoStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addTodo({
        title: '새로운 할 일',
        content: '상세 내용',
        dueDate: '2024-12-31',
      });
      console.log('Todo 추가 성공!');
    } catch (error) {
      console.error('Todo 추가 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={isLoading}>
        추가
      </button>
    </form>
  );
}
```

### Todo 수정
```typescript
import { useTodoStore } from '@/stores';

function EditTodoButton({ todoId }: { todoId: string }) {
  const { updateTodo } = useTodoStore();

  const handleEdit = async () => {
    try {
      await updateTodo(todoId, {
        title: '수정된 제목',
        content: '수정된 내용',
      });
      console.log('Todo 수정 성공!');
    } catch (error) {
      console.error('Todo 수정 실패:', error);
    }
  };

  return <button onClick={handleEdit}>수정</button>;
}
```

### Todo 완료 토글
```typescript
import { useTodoStore } from '@/stores';

function TodoItem({ todoId, isCompleted }: { todoId: string; isCompleted: boolean }) {
  const { toggleComplete } = useTodoStore();

  const handleToggle = async () => {
    try {
      await toggleComplete(todoId);
    } catch (error) {
      console.error('상태 변경 실패:', error);
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleToggle}
      />
    </div>
  );
}
```

### Todo 삭제 및 복원
```typescript
import { useTodoStore } from '@/stores';

function TodoActions({ todoId, status }: { todoId: string; status: string }) {
  const { deleteTodo, restoreTodo, permanentlyDeleteTodo } = useTodoStore();

  const handleDelete = async () => {
    try {
      await deleteTodo(todoId); // 휴지통으로 이동
      console.log('휴지통으로 이동되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreTodo(todoId); // 복원
      console.log('복원되었습니다.');
    } catch (error) {
      console.error('복원 실패:', error);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await permanentlyDeleteTodo(todoId); // 영구 삭제
      console.log('영구 삭제되었습니다.');
    } catch (error) {
      console.error('영구 삭제 실패:', error);
    }
  };

  return (
    <div>
      {status === 'deleted' ? (
        <>
          <button onClick={handleRestore}>복원</button>
          <button onClick={handlePermanentDelete}>영구 삭제</button>
        </>
      ) : (
        <button onClick={handleDelete}>삭제</button>
      )}
    </div>
  );
}
```

## API 서비스 직접 사용 (고급)

Store 대신 API 서비스를 직접 사용할 수도 있습니다:

```typescript
import { authService, todoService } from '@/services';

// 로그인
const response = await authService.login('email@example.com', 'password');

// Todo 조회
const todos = await todoService.getTodos('active');
```

## 에러 핸들링 패턴

```typescript
import { useTodoStore } from '@/stores';

function TodoComponent() {
  const { addTodo, error, clearError } = useTodoStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 에러 초기화
    clearError();
  }, [clearError]);

  const handleAdd = async () => {
    try {
      await addTodo({ title: '새 할 일' });
      // 성공 처리
    } catch (error) {
      // error는 이미 store에 저장되어 있음
      // 추가적인 에러 처리 가능
    }
  };

  return (
    <div>
      {error && (
        <div className="error">
          {error}
          <button onClick={clearError}>닫기</button>
        </div>
      )}
      <button onClick={handleAdd}>추가</button>
    </div>
  );
}
```
