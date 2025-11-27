import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: 할일 목록 조회
 *     description: 사용자의 할일 목록 조회 (필터링 및 정렬 가능)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, all]
 *         description: 할일 상태 필터
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: 우선순위 필터
 *     responses:
 *       200:
 *         description: 할일 목록 조회 성공
 *       401:
 *         description: 인증 실패
 */
router.get('/', authenticateToken, TodoController.getTodos);

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: 새 할일 생성
 *     description: 새로운 할일 항목 생성
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: 할일 생성 성공
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */
router.post('/', authenticateToken, TodoController.createTodo);

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: 할일 상세 조회
 *     description: 특정 할일 항목의 상세 정보 조회
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 조회 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 할일을 찾을 수 없음
 */
router.get('/:id', authenticateToken, TodoController.getTodoById);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: 할일 수정
 *     description: 기존 할일 항목 수정
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 할일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: 할일 수정 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 할일을 찾을 수 없음
 */
router.put('/:id', authenticateToken, TodoController.updateTodo);

/**
 * @swagger
 * /api/todos/{id}/complete:
 *   patch:
 *     summary: 할일 완료 토글
 *     description: 할일의 완료 상태 변경
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 완료 상태 변경 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 할일을 찾을 수 없음
 */
router.patch('/:id/complete', authenticateToken, TodoController.toggleTodoCompletion);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: 할일 삭제
 *     description: 할일을 휴지통으로 이동
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 삭제 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 할일을 찾을 수 없음
 */
router.delete('/:id', authenticateToken, TodoController.deleteTodo);

/**
 * @swagger
 * /api/todos/{id}/restore:
 *   patch:
 *     summary: 할일 복원
 *     description: 휴지통에서 할일 복원
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 할일 ID
 *     responses:
 *       200:
 *         description: 할일 복원 성공
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 할일을 찾을 수 없음
 */
router.patch('/:id/restore', authenticateToken, TodoController.restoreTodo);

export default router;