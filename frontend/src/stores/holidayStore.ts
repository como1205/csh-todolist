import { create } from 'zustand';
import type { Holiday } from '@/types';
import { holidayService, type CreateHolidayInput, type UpdateHolidayInput } from '@/services/holidays';

interface HolidayState {
  holidays: Holiday[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchHolidays: (year?: number) => Promise<void>;
  addHoliday: (holiday: CreateHolidayInput) => Promise<void>;
  updateHoliday: (id: string, updates: UpdateHolidayInput) => Promise<void>;
  deleteHoliday: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useHolidayStore = create<HolidayState>((set) => ({
  holidays: [],
  isLoading: false,
  error: null,

  /**
   * 국경일 목록 조회
   */
  fetchHolidays: async (year?: number) => {
    set({ isLoading: true, error: null });

    try {
      const holidays = await holidayService.getHolidays(year);
      set({ holidays, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '국경일 목록을 불러오는데 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * 국경일 추가
   */
  addHoliday: async (holidayInput: CreateHolidayInput) => {
    set({ isLoading: true, error: null });

    try {
      const newHoliday = await holidayService.createHoliday(holidayInput);

      // 낙관적 업데이트: 새 국경일을 목록에 추가
      set((state) => ({
        holidays: [...state.holidays, newHoliday],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '국경일 추가에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * 국경일 수정
   */
  updateHoliday: async (id: string, updates: UpdateHolidayInput) => {
    set({ isLoading: true, error: null });

    try {
      const updatedHoliday = await holidayService.updateHoliday(id, updates);

      // 낙관적 업데이트: 목록에서 해당 국경일 업데이트
      set((state) => ({
        holidays: state.holidays.map((holiday) =>
          holiday.holidayId === id ? updatedHoliday : holiday
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '국경일 수정에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * 국경일 삭제
   */
  deleteHoliday: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await holidayService.deleteHoliday(id);

      // 목록에서 제거
      set((state) => ({
        holidays: state.holidays.filter((holiday) => holiday.holidayId !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '국경일 삭제에 실패했습니다.';
      set({
        isLoading: false,
        error: errorMessage,
      });
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