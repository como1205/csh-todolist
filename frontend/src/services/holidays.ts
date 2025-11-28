import apiClient from './api';
import type { Holiday } from '@/types';

export interface CreateHolidayInput {
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  isRecurring: boolean;
}

export interface UpdateHolidayInput {
  title?: string;
  date?: string; // YYYY-MM-DD
  description?: string;
  isRecurring?: boolean;
}

export const holidayService = {
  /**
   * 국경일 목록 조회
   * @param year - 특정 연도 (선택)
   */
  getHolidays: async (year?: number): Promise<Holiday[]> => {
    const response = await apiClient.get<{ data: Holiday[] }>('/holidays', {
      params: year ? { year } : undefined,
    });
    return response.data.data;
  },

  /**
   * 특정 국경일 조회
   * @param id - 국경일 ID
   */
  getHoliday: async (id: string): Promise<Holiday> => {
    const response = await apiClient.get<{ data: Holiday }>(`/holidays/${id}`);
    return response.data.data;
  },

  /**
   * 새 국경일 생성 (관리자 전용)
   */
  createHoliday: async (holiday: CreateHolidayInput): Promise<Holiday> => {
    const response = await apiClient.post<{ data: Holiday }>('/holidays', holiday);
    return response.data.data;
  },

  /**
   * 국경일 수정 (관리자 전용)
   */
  updateHoliday: async (id: string, updates: UpdateHolidayInput): Promise<Holiday> => {
    const response = await apiClient.put<{ data: Holiday }>(`/holidays/${id}`, updates);
    return response.data.data;
  },

  /**
   * 국경일 삭제 (관리자 전용)
   */
  deleteHoliday: async (id: string): Promise<void> => {
    await apiClient.delete(`/holidays/${id}`);
  },
};