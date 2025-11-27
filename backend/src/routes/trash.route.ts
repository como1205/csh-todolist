import { Router } from 'express';
import { TrashController } from '../controllers/trash.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// 휴지통 관련 라우트 (인증 필요)
router.get('/', authenticateToken, TrashController.getTrashedTodos);
router.delete('/:id', authenticateToken, TrashController.permanentlyDeleteTodo);
router.patch('/:id/restore', authenticateToken, TrashController.restoreTodo);

export default router;