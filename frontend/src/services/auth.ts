import apiClient from './api';
import type { User } from '@/types';

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  /**
   * 로그인
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<{ data: LoginResponse }>('/auth/login', {
      email,
      password,
    });
    return response.data.data;
  },

  /**
   * 회원가입
   */
  register: async (
    email: string,
    password: string,
    username: string
  ): Promise<RegisterResponse> => {
    const response = await apiClient.post<{ data: RegisterResponse }>('/auth/register', {
      email,
      password,
      username,
    });
    return response.data.data;
  },

  /**
   * 토큰 재발급
   */
  refresh: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await apiClient.post<{ data: RefreshResponse }>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
