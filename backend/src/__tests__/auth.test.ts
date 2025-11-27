import request from 'supertest';
import app from '../app';
import * as bcrypt from 'bcrypt';
import { pool } from '../config/database';

describe('Auth API', () => {
  beforeEach(async () => {
    // 테스트 전에 필요한 초기화 작업
  });

  afterEach(async () => {
    // 테스트 후에 사용자 테이블 비우기
    await pool.query('DELETE FROM users WHERE email LIKE \'%test%\'');
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return error for existing email', async () => {
      // 첫 번째 사용자 등록
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        username: 'Test User'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // 두 번째 등록 시도 (이메일 중복)
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // 테스트 사용자 생성
      const hashedPassword = await bcrypt.hash('password123', 10);
      await pool.query(
        'INSERT INTO users (email, password, username) VALUES ($1, $2, $3)',
        ['login@example.com', hashedPassword, 'Login User']
      );

      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token', async () => {
      // 실제 JWT 토큰을 사용하는 테스트는 실제 토큰이 필요하므로 나중에 구현
    });
  });
});