// Holiday 타입 정의
export interface Holiday {
  holidayId: string;
  title: string;
  date: string; // ISO date string
  description?: string;
  isRecurring: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// 새 국경일 생성 요청 타입
export interface CreateHolidayRequest {
  title: string;
  date: string; // ISO date string
  description?: string;
  isRecurring: boolean;
}

// 국경일 수정 요청 타입
export interface UpdateHolidayRequest {
  title?: string;
  date?: string; // ISO date string
  description?: string;
  isRecurring?: boolean;
}

// 국경일 목록 조회 쿼리 파라미터 타입
export interface HolidayListQuery {
  year?: number;
}