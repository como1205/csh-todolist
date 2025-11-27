import { Router } from 'express';
import { HolidayController } from '../controllers/holiday.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

// 국경일 관련 라우트
// 인증 없이 조회 가능
router.get('/', HolidayController.getHolidays);

// 관리자 전용
router.post('/', authenticateToken, requireAdmin, HolidayController.createHoliday);
router.put('/:id', authenticateToken, requireAdmin, HolidayController.updateHoliday);
router.delete('/:id', authenticateToken, requireAdmin, HolidayController.deleteHoliday);

export default router;