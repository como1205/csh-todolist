## 📋 설명

`react-router-dom`을 사용하여 페이지 라우팅을 설정하고, 공통 `Header`와 페이지 구조를 위한 `Layout` 컴포넌트를 구현합니다.

## ✅ Todo

- [ ] `react-router-dom`의 `createBrowserRouter`를 사용하여 라우팅 설정 완료
- [ ] 공통 `Layout` 컴포넌트(Header 포함) 구현 및 각 페이지에 적용
- [ ] 로그인 여부에 따라 접근을 제어하는 `PrivateRoute` 컴포넌트 구현

## ✅ 완료 조건

1. 라우터 설정 (`src/router.tsx` 또는 `src/App.tsx`)
   ```tsx
   const router = createBrowserRouter([
     {
       path: '/login',
       element: <LoginPage />,
     },
     {
       path: '/register',
       element: <RegisterPage />,
     },
     {
       element: <PrivateRoute />,
       children: [
         {
           path: '/',
           element: <Layout />,
           children: [
             { index: true, element: <TodoListPage /> },
             { path: 'trash', element: <TrashPage /> },
           ],
         },
       ],
     },
   ]);
   ```

2. Layout 컴포넌트 구현 (`src/components/layout/Layout.tsx`)
   - Header 컴포넌트 포함
   - Outlet으로 자식 라우트 렌더링
   - 반응형 레이아웃 (Tailwind CSS)

3. Header 컴포넌트 구현 (`src/components/layout/Header.tsx`)
   - 로고 또는 앱 제목
   - 네비게이션 메뉴: 할일 목록, 휴지통
   - 사용자 정보 (이름, 이메일)
   - 로그아웃 버튼

4. PrivateRoute 컴포넌트 구현 (`src/components/PrivateRoute.tsx`)
   - 로그인 상태 확인 (Zustand store 사용)
   - 미로그인 시 `/login`으로 리다이렉트
   - 로그인 상태면 Outlet 렌더링

5. 페이지 컴포넌트 스켈레톤 생성
   - `src/pages/LoginPage.tsx`
   - `src/pages/RegisterPage.tsx`
   - `src/pages/TodoListPage.tsx`
   - `src/pages/TrashPage.tsx`

6. 라우터 적용 및 테스트
   ```tsx
   // src/main.tsx
   import { RouterProvider } from 'react-router-dom';
   import { router } from './router';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <RouterProvider router={router} />
     </React.StrictMode>
   );
   ```

## 🔧 기술적 고려사항

**사용 라이브러리**:
- react-router-dom v6

**Layout 컴포넌트 예시**:
```tsx
// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

**Header 컴포넌트 예시**:
```tsx
// src/components/layout/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">csh-TodoList</h1>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-blue-600">할일 목록</Link>
          <Link to="/trash" className="hover:text-blue-600">휴지통</Link>
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="btn-primary">
            로그아웃
          </button>
        </nav>
      </div>
    </header>
  );
}
```

**PrivateRoute 예시**:
```tsx
// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

**주의사항**:
- Zustand authStore는 Task 3.3에서 구현됨
- 이 단계에서는 스켈레톤 페이지만 생성 (실제 UI는 후속 Task에서)
- Tailwind CSS 클래스 사용
- 반응형 디자인 고려 (모바일, 태블릿, 데스크톱)

## 🔗 의존성

**선행 작업**:
- Task 1.2: 프론트엔드 프로젝트 초기화

**후행 작업**:
- Task 3.2: 공통 UI 컴포넌트 개발
- Task 3.3: 전역 상태 및 API 클라이언트 설정
- Task 3.4: 회원가입 및 로그인 페이지 구현
- Task 3.5: 할일 목록 페이지 구현
- Task 3.6: 휴지통 페이지 구현

## 👤 담당

`frontend-developer`

## 📚 참고 문서

- docs/3-prd.md (10.2장: 페이지 구성)
- React Router v6: https://reactrouter.com/en/main
- createBrowserRouter: https://reactrouter.com/en/main/routers/create-browser-router
- Protected Routes: https://reactrouter.com/en/main/start/tutorial#protected-routes
