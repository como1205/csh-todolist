import { Request, Response } from 'express';
import { HolidayService } from '../services/holiday.service';
import { CreateHolidayRequest, UpdateHolidayRequest, HolidayListQuery } from '../types/holiday.types';

export class HolidayController {
  // 국경일 목록 조회 (인증 필요 없음)
  static async getHolidays(req: Request, res: Response): Promise<void> {
    try {
      const query: HolidayListQuery = {
        year: req.query.year ? parseInt(req.query.year as string, 10) : undefined,
        month: req.query.month ? parseInt(req.query.month as string, 10) : undefined
      };

      const holidays = await HolidayService.getHolidays(query);

      res.status(200).json({
        success: true,
        data: holidays
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_HOLIDAYS_ERROR',
          message: error.message
        }
      });
    }
  }

  // 국경일 생성 (관리자 전용)
  static async createHoliday(req: Request, res: Response): Promise<void> {
    try {
      const holidayData: CreateHolidayRequest = req.body;

      const holiday = await HolidayService.createHoliday(holidayData);

      res.status(201).json({
        success: true,
        data: holiday
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_HOLIDAY_ERROR',
          message: error.message
        }
      });
    }
  }

  // 국경일 수정 (관리자 전용)
  static async updateHoliday(req: Request, res: Response): Promise<void> {
    try {
      const holidayId = req.params.id;
      const updateData: UpdateHolidayRequest = req.body;

      const holiday = await HolidayService.updateHoliday(holidayId, updateData);

      if (!holiday) {
        res.status(404).json({
          success: false,
          error: {
            code: 'HOLIDAY_NOT_FOUND',
            message: '국경일을 찾을 수 없습니다'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: holiday
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: {
          code: 'UPDATE_HOLIDAY_ERROR',
          message: error.message
        }
      });
    }
  }

  // 국경일 삭제 (관리자 전용)
  static async deleteHoliday(req: Request, res: Response): Promise<void> {
    try {
      const holidayId = req.params.id;

      const success = await HolidayService.deleteHoliday(holidayId);

      if (!success) {
        res.status(404).json({
          success: false,
          error: {
            code: 'HOLIDAY_NOT_FOUND',
            message: '국경일을 찾을 수 없습니다'
          }
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: '국경일이 삭제되었습니다'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_HOLIDAY_ERROR',
          message: error.message
        }
      });
    }
  }
}