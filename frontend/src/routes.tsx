import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoListPage from './pages/TodoListPage';
import TrashPage from './pages/TrashPage';
import HolidaysPage from './pages/HolidaysPage';
import ProfilePage from './pages/ProfilePage';
import ComponentShowcase from './pages/ComponentShowcase';

export const router = createBrowserRouter([
  // 공개 라우트
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // 개발용 컴포넌트 쇼케이스
  {
    path: '/showcase',
    element: <ComponentShowcase />,
  },

  // 보호된 라우트 (Layout 포함)
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute element={<TodoListPage />} />,
      },
      {
        path: '/trash',
        element: <PrivateRoute element={<TrashPage />} />,
      },
      {
        path: '/holidays',
        element: <PrivateRoute element={<HolidaysPage />} />,
      },
      {
        path: '/profile',
        element: <PrivateRoute element={<ProfilePage />} />,
      },
    ],
  },
]);
