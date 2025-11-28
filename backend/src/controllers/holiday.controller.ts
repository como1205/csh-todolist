import { Request, Response } from 'express';
import { HolidayService } from '../services/holiday.service';
import { CreateHolidayRequest, UpdateHolidayRequest } from '../types/holiday.types';

export class HolidayController {
  // 국경일 목록 조회
  static async getHolidays(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;

      const holidays = await HolidayService.getHolidays(year);

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

  // 특정 국경일 조회
  static async getHolidayById(req: Request, res: Response): Promise<void> {
    try {
      const holidayId = req.params.id;

      const holiday = await HolidayService.getHolidayById(holidayId);

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
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_HOLIDAY_ERROR',
          message: error.message
        }
      });
    }
  }

  // 새 국경일 생성 (관리자 전용)
  static async createHoliday(req: Request, res: Response): Promise<void> {
    try {
      // 관리자 권한 확인
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '국경일 생성은 관리자만 가능합니다'
          }
        });
        return;
      }

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
      // 관리자 권한 확인
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '국경일 수정은 관리자만 가능합니다'
          }
        });
        return;
      }

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
      // 관리자 권한 확인
      if (req.user?.role !== 'ADMIN') {
        res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: '국경일 삭제는 관리자만 가능합니다'
          }
        });
        return;
      }

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