import { Router } from 'express';
import { HolidayController } from '../controllers/holiday.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/holidays:
 *   get:
 *     summary: 국경일 목록 조회
 *     description: 모든 국경일 목록 조회 (년도 필터 가능)
 *     tags: [Holidays]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: 특정 연도 국경일 조회
 *     responses:
 *       200:
 *         description: 국경일 목록 조회 성공
 */
router.get('/', HolidayController.getHolidays);

/**
 * @swagger
 * /api/holidays/{id}:
 *   get:
 *     summary: 특정 국경일 조회
 *     description: 특정 국경일 상세 정보 조회
 *     tags: [Holidays]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 국경일 ID
 *     responses:
 *       200:
 *         description: 국경일 조회 성공
 *       404:
 *         description: 국경일을 찾을 수 없음
 */
router.get('/:id', HolidayController.getHolidayById);

// 관리자 전용 라우트
router.use(authenticateToken);

/**
 * @swagger
 * /api/holidays:
 *   post:
 *     summary: 새 국경일 생성
 *     description: 새 국경일 항목 생성 (관리자 전용)
 *     tags: [Holidays]
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
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *                 description: 국경일 이름
 *               date:
 *                 type: string
 *                 format: date
 *                 description: 국경일 날짜
 *               description:
 *                 type: string
 *                 description: 국경일 설명
 *               isRecurring:
 *                 type: boolean
 *                 description: 매년 반복 여부
 *     responses:
 *       201:
 *         description: 국경일 생성 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 */
router.post('/', HolidayController.createHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   put:
 *     summary: 국경일 수정
 *     description: 기존 국경일 수정 (관리자 전용)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 국경일 ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 국경일 이름
 *               date:
 *                 type: string
 *                 format: date
 *                 description: 국경일 날짜
 *               description:
 *                 type: string
 *                 description: 국경일 설명
 *               isRecurring:
 *                 type: boolean
 *                 description: 매년 반복 여부
 *     responses:
 *       200:
 *         description: 국경일 수정 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 국경일을 찾을 수 없음
 */
router.put('/:id', HolidayController.updateHoliday);

/**
 * @swagger
 * /api/holidays/{id}:
 *   delete:
 *     summary: 국경일 삭제
 *     description: 국경일 삭제 (관리자 전용)
 *     tags: [Holidays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 국경일 ID
 *     responses:
 *       200:
 *         description: 국경일 삭제 성공
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 국경일을 찾을 수 없음
 */
router.delete('/:id', HolidayController.deleteHoliday);

export default router;