import request from 'supertest';
import app from '../app';
import * as jwt from 'jsonwebtoken';
import { pool } from '../config/database';

describe('Holiday API', () => {
  let adminToken: string;
  let holidayId: string;

  beforeAll(() => {
    // 관리자용 JWT 토큰 생성
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_access_secret';
    adminToken = jwt.sign(
      { userId: 'admin-user-id', email: 'admin@example.com', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
  });

  afterAll(async () => {
    // 테스트 후 holiday 데이터 정리
    if (holidayId) {
      await pool.query('DELETE FROM holidays WHERE "holidayId" = $1', [holidayId]);
    }
  });

  describe('GET /api/holidays', () => {
    it('should get holidays list', async () => {
      const response = await request(app)
        .get('/api/holidays')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/holidays (Admin only)', () => {
    it('should create a new holiday with admin token', async () => {
      const holidayData = {
        title: 'Test Holiday',
        date: '2025-01-01',
        description: 'Test holiday description'
      };

      const response = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(holidayData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(holidayData.title);
      expect(response.body.data.date).toBe(holidayData.date);
      
      // 생성된 holiday ID 저장 (나중에 사용)
      holidayId = response.body.data.holidayId;
    });

    it('should return 401 without token', async () => {
      const holidayData = {
        title: 'Unauthorized Holiday',
        date: '2025-02-01'
      };

      const response = await request(app)
        .post('/api/holidays')
        .send(holidayData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/holidays/:id (Admin only)', () => {
    it('should update a holiday with admin token', async () => {
      const updateData = {
        title: 'Updated Test Holiday',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/holidays/${holidayId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });
  });

  describe('DELETE /api/holidays/:id (Admin only)', () => {
    it('should delete a holiday with admin token', async () => {
      // 새로운 테스트용 holiday 생성
      const newHoliday = {
        title: 'Temp Holiday to Delete',
        date: '2025-03-01'
      };

      const createResponse = await request(app)
        .post('/api/holidays')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newHoliday)
        .expect(201);

      const tempHolidayId = createResponse.body.data.holidayId;

      // 삭제 테스트
      const response = await request(app)
        .delete(`/api/holidays/${tempHolidayId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('국경일이 삭제되었습니다');
    });
  });
});