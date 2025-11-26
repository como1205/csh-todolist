## 📋 설명

Zustand Store와 Axios 인스턴스를 설정합니다.

## ✅ Todo

- [ ] `authStore` (로그인 상태, 토큰), `todoStore` (할일 목록) 구현 완료
- [ ] `axios` 인스턴스에 `baseURL` 설정 (`.env` 파일 활용)
- [ ] API 요청 시 토큰을 헤더에 추가하고, 401 에러 시 토큰을 재발급하는 인터셉터 구현

## ✅ 완료 조건

### 1. Zustand Store 구현

**authStore (`src/store/authStore.ts`)**
- 상태: `user`, `accessToken`, `refreshToken`, `isAuthenticated`
- 액션: `login`, `logout`, `setTokens`, `refreshAccessToken`

**todoStore (`src/store/todoStore.ts`)**
- 상태: `todos`, `isLoading`, `error`
- 액션: `setTodos`, `addTodo`, `updateTodo`, `deleteTodo`, `toggleComplete`

### 2. Axios 인스턴스 설정 (`src/api/axios.ts`)
- `baseURL`: 환경변수에서 읽기 (`VITE_API_BASE_URL`)
- `timeout`: 10000ms
- 기본 헤더: `Content-Type: application/json`

### 3. Request Interceptor
- 모든 요청에 `Authorization: Bearer {accessToken}` 헤더 추가
- authStore에서 accessToken 자동 가져오기

### 4. Response Interceptor
- 401 Unauthorized 에러 발생 시:
  1. Refresh Token으로 새 Access Token 요청
  2. 성공 시: 새 토큰 저장 후 원래 요청 재시도
  3. 실패 시: 로그아웃 처리 및 로그인 페이지로 리다이렉트

### 5. 환경변수 설정 (`.env`)
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 6. LocalStorage 연동
- authStore의 토큰을 localStorage에 자동 저장
- 페이지 새로고침 시 localStorage에서 토큰 복원

## 🔧 기술적 고려사항

**authStore 예시**:
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**todoStore 예시**:
```typescript
// src/store/todoStore.ts
import { create } from 'zustand';
import { Todo } from '@/types/todo';

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;

  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  isLoading: false,
  error: null,

  setTodos: (todos) => set({ todos }),

  addTodo: (todo) =>
    set((state) => ({ todos: [todo, ...state.todos] })),

  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTodo: (id) =>
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),

  toggleComplete: (id) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    })),
}));
```

**Axios 인스턴스 예시**:
```typescript
// src/api/axios.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setTokens } = useAuthStore.getState();

        // Refresh Token으로 새 Access Token 요청
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data;
        setTokens(accessToken, refreshToken!);

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 로그아웃
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**타입 정의**:
```typescript
// src/types/todo.ts
export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: string;
  isCompleted: boolean;
  dueDate?: string;
  isDeleted: boolean;
  deletedAt?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

**필요한 패키지**:
```bash
npm install zustand axios
```

**주의사항**:
- Zustand persist 미들웨어로 localStorage 자동 동기화
- Axios interceptor에서 무한 루프 방지 (`_retry` 플래그)
- Refresh Token 실패 시 로그아웃 처리
- 환경변수는 `VITE_` 접두사 필수 (Vite 규칙)

## 🔗 의존성

**선행 작업**:
- Task 1.2: 프론트엔드 프로젝트 초기화

**후행 작업**:
- Task 3.4: 회원가입 및 로그인 페이지 구현
- Task 3.5: 할일 목록 페이지 구현
- Task 3.6: 휴지통 페이지 구현

## 👤 담당

`react-specialist`

## 📚 참고 문서

- docs/3-prd.md (10.4장: 상태 관리)
- Zustand: https://zustand-demo.pmnd.rs/
- Zustand Persist: https://docs.pmnd.rs/zustand/integrations/persisting-store-data
- Axios Interceptors: https://axios-http.com/docs/interceptors
- Vite 환경변수: https://vitejs.dev/guide/env-and-mode.html
