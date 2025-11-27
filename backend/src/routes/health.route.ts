import { Router } from 'express';

export const healthCheck: Router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: 헬스 체크
 *     description: API 서버 상태 확인
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: 서버 정상 작동
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
healthCheck.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});