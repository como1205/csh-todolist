import { pool } from '../config/database';
import { Holiday, CreateHolidayRequest, UpdateHolidayRequest } from '../types/holiday.types';

export class HolidayService {
  // 국경일 목록 조회
  static async getHolidays(year?: number): Promise<Holiday[]> {
    let query = `
      SELECT "holidayId", title, date, description, "isRecurring", "createdAt", "updatedAt"
      FROM holidays
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (year) {
      // 특정 연도의 국경일만 조회 (isRecurring이 true인 경우 해당 연도로 처리)
      query += ` WHERE EXTRACT(YEAR FROM date) = $1 OR "isRecurring" = true`;
      params.push(year);
    }

    query += ` ORDER BY date ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

  // 특정 국경일 조회
  static async getHolidayById(holidayId: string): Promise<Holiday | null> {
    const query = `
      SELECT "holidayId", title, date, description, "isRecurring", "createdAt", "updatedAt"
      FROM holidays
      WHERE "holidayId" = $1
    `;

    const result = await pool.query(query, [holidayId]);
    return result.rows[0] || null;
  }

  // 새 국경일 생성
  static async createHoliday(holidayData: CreateHolidayRequest): Promise<Holiday> {
    const { title, date, description, isRecurring } = holidayData;

    const query = `
      INSERT INTO holidays (title, date, description, "isRecurring")
      VALUES ($1, $2, $3, $4)
      RETURNING "holidayId", title, date, description, "isRecurring", "createdAt", "updatedAt"
    `;

    const result = await pool.query(query, [title, date, description, isRecurring]);
    return result.rows[0];
  }

  // 국경일 수정
  static async updateHoliday(holidayId: string, updateData: UpdateHolidayRequest): Promise<Holiday | null> {
    const { title, date, description, isRecurring } = updateData;

    const query = `
      UPDATE holidays
      SET title = COALESCE($1, title),
          date = COALESCE($2, date),
          description = COALESCE($3, description),
          "isRecurring" = COALESCE($4, "isRecurring"),
          "updatedAt" = NOW()
      WHERE "holidayId" = $5
      RETURNING "holidayId", title, date, description, "isRecurring", "createdAt", "updatedAt"
    `;

    const result = await pool.query(query, [title, date, description, isRecurring, holidayId]);
    return result.rows[0] || null;
  }

  // 국경일 삭제
  static async deleteHoliday(holidayId: string): Promise<boolean> {
    const query = `
      DELETE FROM holidays
      WHERE "holidayId" = $1
      RETURNING "holidayId"
    `;

    const result = await pool.query(query, [holidayId]);
    return result.rows.length > 0;
  }
}