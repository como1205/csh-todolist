import { Router } from 'express';
import { healthCheck } from './health.route';
import authRoutes from './auth.route';
import todoRoutes from './todo.route';
import trashRoutes from './trash.route';
import holidayRoutes from './holiday.route';

const router = Router();

// API 라우트 설정
router.use('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/trash', trashRoutes);
router.use('/holidays', holidayRoutes);

export default router;