import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface PrivateRouteProps {
  element: React.ReactElement;
  requiredRole?: 'admin' | 'user';
}

export default function PrivateRoute({ element, requiredRole }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 권한이 필요한 경우 권한 체크
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return element;
}
