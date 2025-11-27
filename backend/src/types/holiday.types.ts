export interface Holiday {
  holidayId: string;
  title: string;
  date: Date;
  description?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHolidayRequest {
  title: string;
  date: string; // ISO string format
  description?: string;
  isRecurring?: boolean;
}

export interface UpdateHolidayRequest {
  title?: string;
  date?: string; // ISO string format
  description?: string;
  isRecurring?: boolean;
}

export interface HolidayListQuery {
  year?: number;
  month?: number;
}