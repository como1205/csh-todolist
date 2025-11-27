import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '@/services/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

// localStorage에서 초기 상태 복원
const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userStr = localStorage.getItem('user');

  if (accessToken && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      // JSON 파싱 실패 시 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  return {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...getInitialState(),

  /**
   * 로그인
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password
      );

      // localStorage에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '로그인에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * 회원가입
   */
  register: async (email: string, password: string, username: string) => {
    set({ isLoading: true, error: null });

    try {
      const { user, accessToken, refreshToken } = await authService.register(
        email,
        password,
        username
      );

      // localStorage에 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '회원가입에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: () => {
    try {
      // 백엔드에 로그아웃 요청 (비동기지만 대기하지 않음)
      authService.logout().catch(() => {
        // 에러 무시 (토큰이 만료되었을 수도 있음)
      });
    } catch (error) {
      // 에러 무시
    } finally {
      // localStorage에서 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      });
    }
  },

  /**
   * 토큰 설정
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },

  /**
   * 액세스 토큰 재발급
   */
  refreshAccessToken: async () => {
    const { refreshToken } = get();

    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다.');
    }

    try {
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = await authService.refresh(refreshToken);

      // localStorage에 저장
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      set({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      // 리프레시 토큰도 만료된 경우 로그아웃
      get().logout();
      throw error;
    }
  },

  /**
   * 에러 초기화
   */
  clearError: () => {
    set({ error: null });
  },
}));
