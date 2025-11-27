import { pool } from '../config/database';
import { Holiday, CreateHolidayRequest, UpdateHolidayRequest, HolidayListQuery } from '../types/holiday.types';

export class HolidayService {
  // 국경일 목록 조회
  static async getHolidays(query?: HolidayListQuery): Promise<Holiday[]> {
    let queryStr = `
      SELECT "holidayId", title, date, description, "isRecurring", "createdAt", "updatedAt"
      FROM holidays
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // 연도 필터
    if (query?.year) {
      queryStr += ` WHERE EXTRACT(YEAR FROM date) = $${paramIndex}`;
      params.push(query.year);
      paramIndex++;

      // 월 필터
      if (query?.month) {
        queryStr += ` AND EXTRACT(MONTH FROM date) = $${paramIndex}`;
        params.push(query.month);
      }
    } else if (query?.month) {
      // 월만 있을 경우는 연도가 필요한데, 기본으로 올해 연도 사용
      const currentYear = new Date().getFullYear();
      queryStr += ` WHERE EXTRACT(YEAR FROM date) = $${paramIndex} AND EXTRACT(MONTH FROM date) = $${paramIndex + 1}`;
      params.push(currentYear, query.month);
    }

    queryStr += ` ORDER BY date ASC`;

    const result = await pool.query(queryStr, params);
    return result.rows;
  }

  // 국경일 생성
  static async createHoliday(holidayData: CreateHolidayRequest): Promise<Holiday> {
    const { title, date, description, isRecurring = true } = holidayData;

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

    // 기존 데이터 가져오기
    const existingHoliday = await this.getHolidayById(holidayId);
    if (!existingHoliday) {
      return null;
    }

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
    return result.rows[0];
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
}